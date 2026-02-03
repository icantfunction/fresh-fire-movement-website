# Audition Table Split (AWS)

This update keeps workshop records in `FFDMWorkshopRegistrations` and stores audition signups in a separate `FFDMAuditionSignups` table.

## 1) Create audition table

```powershell
$Region = "us-east-1"
aws dynamodb create-table `
  --table-name FFDMAuditionSignups `
  --attribute-definitions AttributeName=registrationId,AttributeType=S `
  --key-schema AttributeName=registrationId,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region $Region
```

## 2) Add audition API routes

```powershell
$ApiId = "y5w6n0i9vc"
$Region = "us-east-1"
$routes = aws apigatewayv2 get-routes --api-id $ApiId --region $Region | ConvertFrom-Json
$workshopPostRoute = $routes.Items | Where-Object { $_.RouteKey -eq "POST /workshop" }
$workshopGetRoute = $routes.Items | Where-Object { $_.RouteKey -eq "GET /workshop" }
$workshopAttendanceRoute = $routes.Items | Where-Object { $_.RouteKey -eq "POST /workshop/attendance" }

aws apigatewayv2 create-route --api-id $ApiId --region $Region --route-key "POST /audition" --target $workshopPostRoute.Target
aws apigatewayv2 create-route --api-id $ApiId --region $Region --route-key "GET /audition" --target $workshopGetRoute.Target
aws apigatewayv2 create-route --api-id $ApiId --region $Region --route-key "POST /audition/attendance" --target $workshopAttendanceRoute.Target
aws apigatewayv2 create-deployment --api-id $ApiId --region $Region --stage-name prod
```

## 3) Update Lambda environment variables

Set both Lambdas to read from both tables:

```powershell
$Region = "us-east-1"
$WorkshopTable = "FFDMWorkshopRegistrations"
$AuditionTable = "FFDMAuditionSignups"

aws lambda update-function-configuration `
  --function-name submitWorkshopRegistration `
  --region $Region `
  --environment "Variables={TABLE_NAME=$WorkshopTable,WORKSHOP_TABLE_NAME=$WorkshopTable,AUDITION_TABLE_NAME=$AuditionTable}"

aws lambda update-function-configuration `
  --function-name workshopAdmin `
  --region $Region `
  --environment "Variables={TABLE_NAME=$WorkshopTable,WORKSHOP_TABLE_NAME=$WorkshopTable,AUDITION_TABLE_NAME=$AuditionTable}"
```

## 4) Deploy Lambda code changes

Deploy updated `infra/lambda/submitWorkshopRegistration/index.js` and `infra/lambda/workshopAdmin/index.js` so each path writes/reads its own table.
