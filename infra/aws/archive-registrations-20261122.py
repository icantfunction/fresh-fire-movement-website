"""Classify Fresh Fire signups at the November 22 reopening. Pass --apply to write."""

import argparse
from collections import Counter
from datetime import datetime

import boto3
from boto3.dynamodb.conditions import Attr


TABLES = ("FFDMWorkshopRegistrations", "FFDMAuditionSignups")
CUTOFF = datetime.fromisoformat("2026-11-22T00:00:00-05:00")


def registration_status(created_at):
    timestamp = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    return "ARCHIVED" if timestamp < CUTOFF else "ACTIVE"


def classify(table, apply):
    counts = Counter()
    pages = table.meta.client.get_paginator("scan").paginate(
        TableName=table.name,
        ProjectionExpression="registrationId, createdAt, registrationStatus",
        ConsistentRead=True,
    )
    for page in pages:
        for row in page["Items"]:
            previous = row.get("registrationStatus")
            target = registration_status(row["createdAt"])
            if previous == target or previous == "ARCHIVED":
                continue
            if previous not in (None, "ACTIVE"):
                raise ValueError(f"Unexpected registration status in {table.name}")
            if apply:
                status = Attr("registrationStatus")
                table.update_item(
                    Key={"registrationId": row["registrationId"]},
                    UpdateExpression="SET registrationStatus = :target",
                    ExpressionAttributeValues={":target": target},
                    ConditionExpression=(
                        Attr("createdAt").eq(row["createdAt"])
                        & (status.not_exists() if previous is None else status.eq(previous))
                    ),
                )
            counts[target] += 1
    return counts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    db = boto3.resource("dynamodb", region_name="us-east-1")
    for table_name in TABLES:
        counts = classify(db.Table(table_name), args.apply)
        action = "updated" if args.apply else "would update"
        print(f"{table_name}: {action} {counts['ARCHIVED']} to ARCHIVED and {counts['ACTIVE']} to ACTIVE")
