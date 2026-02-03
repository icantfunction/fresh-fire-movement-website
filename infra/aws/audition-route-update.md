# Audition Route Update (AWS)

This keeps existing `/workshop` routes active and adds `/audition` aliases that point to the same backend resources.

## 1) Find your existing integration targets

- Existing submit route target: `POST /workshop` (Lambda: submit workshop registration)
- Existing admin route target: `GET /workshop` and `POST /workshop/attendance` (Lambda: workshop admin)

## 2) Add new HTTP API routes (same integrations)

Use your API ID and region:

```powershell
$ApiId = "<http-api-id>"
$Region = "us-east-1"

# Find existing integration IDs from workshop routes
$routes = aws apigatewayv2 get-routes --api-id $ApiId --region $Region | ConvertFrom-Json
$workshopPostRoute = $routes.Items | Where-Object { $_.RouteKey -eq "POST /workshop" }
$workshopGetRoute = $routes.Items | Where-Object { $_.RouteKey -eq "GET /workshop" }
$workshopAttendanceRoute = $routes.Items | Where-Object { $_.RouteKey -eq "POST /workshop/attendance" }

aws apigatewayv2 create-route --api-id $ApiId --region $Region --route-key "POST /audition" --target $workshopPostRoute.Target
aws apigatewayv2 create-route --api-id $ApiId --region $Region --route-key "GET /audition" --target $workshopGetRoute.Target
aws apigatewayv2 create-route --api-id $ApiId --region $Region --route-key "POST /audition/attendance" --target $workshopAttendanceRoute.Target

# Deploy routes to prod stage (or your active stage)
aws apigatewayv2 create-deployment --api-id $ApiId --region $Region --stage-name prod
```

## 3) Lambda permissions

If your API Gateway invoke permissions are route-scoped, add matching permissions for the new `/audition*` routes on the same Lambda functions.

