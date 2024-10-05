# Snomad API Documentation

## Project Description
- **Project Name**: Snomad API
- **Purpose**: The aim of this application is to make it easier for buyers to find food sellers who are always moving from place to place.
- **Core Features**: 
  - Location sharing
  - Store management
  - Store menu management
  - Review system
  - Favorite list for stores
- **Technologies**: Typescript, Node.js, Express, MongoDB, JWT, WebSocket, Cloudinary.
- **Target Audience**: Sellers who are always moving and buyers who want to find food sellers on the move.

---

## Engineer Information
- **Full Name**: Joko Setiawan
- **Role**: Software Engineer
- **Contact Information**: 
  - Email: [jokosetiawan.career@gmail.com](mailto:jokosetiawan.career@gmail.com)
  - LinkedIn: [https://www.linkedin.com/in/jstwan/](https://www.linkedin.com/in/jstwan/)

---

# API Documentation - Authentication 

## Endpoints

### 1. **Register a New User**

**URL**: `/auth/register`

**Method**: `POST`

**Description**: Registers a new user account.

**Request Body**:

```json
{
  "name": "test",
  "email": "test@example.com",
  "password": "password123",
  "role": "seller"
}
```

- `name`: (string) User's full name (required)
- `email`: (string) User's email (required, must be unique)
- `password`: (string) User's password (required)
- `role`: (string) Role of the user (e.g., seller, admin)

**Response**:

- **Success**: `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "64f0b0f4b501c7f123456789",
      "name": "test",
      "email": "test@example.com",
      "role": "seller"
    },
    "token": "<JWT Token>"
  }
  ```

- **Error**: 
  - `400 Bad Request`: If the required fields are missing or the user already exists.
    ```json
    {
      "message": "User already exists"
    }
    ```
  - `500 Internal Server Error`: If there's a server error.

---

### 2. **User Login**

**URL**: `/auth/login`

**Method**: `POST`

**Description**: Logs a user in by generating an access token and refresh token.

**Request Body**:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

- `email`: (string) User's email (required)
- `password`: (string) User's password (required)

**Response**:

- **Success**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "64f0b0f4b501c7f123456789",
      "name": "test",
      "email": "test@example.com",
      "role": "seller",
      "store": {
        "storeId": "64f0b0f4b501c7f123456780",
        "name": "test Store"
      }
    }
  }
  ```

  - Two cookies will also be set:
    - `accessToken`: The JWT access token (15-minute expiry).
    - `refreshToken`: The JWT refresh token (7-day expiry).

- **Error**: 
  - `404 Not Found`: If the email is incorrect.
    ```json
    {
      "message": "Invalid email or password"
    }
    ```
  - `400 Bad Request`: If the password is incorrect or the account is locked.
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

---

### 3. **Refresh Token**

**URL**: `/auth/refresh-token`

**Method**: `POST`

**Description**: Refreshes the user's access token using the refresh token.

**Headers**: Requires `refreshToken` cookie to be present.

**Response**:

- **Success**: `200 OK`
  - A new `accessToken` cookie will be set.
  ```json
  {
    "message": "Access token refreshed"
  }
  ```

- **Error**:
  - `401 Unauthorized`: If the `refreshToken` cookie is missing.
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - `403 Forbidden`: If the refresh token is invalid.
    ```json
    {
      "message": "Invalid refresh token"
    }
    ```

---

### 4. **Logout**

**URL**: `/auth/logout`

**Method**: `POST`

**Description**: Logs the user out by clearing the token cookies.

**Response**:

- **Success**: `200 OK`
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

## Authentication

- **Access Token**: Tokens are stored in HTTP-only cookies and should be included in all requests.
- **Refresh Token**: Used to refresh access tokens and must be included as an HTTP-only cookie in the `/refresh-token` endpoint.

---

## Middleware

1. **Input Validation**:
   - Validates `name`, `email`, `password`, and `role` on registration.
   - Validates `email` and `password` on login.

2. **Authentication Middleware**:
   - Protects the `/refresh-token` and `/logout` routes, ensuring that only authenticated users can access them.

---

# API Documentation - Password Reset 

## Endpoints

### 1. Request Password Reset (Send OTP)

**URL:** `/auth/password/request-reset`  
**Method:** `POST`  
**Description:** This endpoint allows a user to request a password reset by sending a One-Time Password (OTP) to their registered email.

#### Request Body:

| Field  | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| email  | string | Yes      | The user's registered email.     |

#### Response Example (Success):
```json
{
  "message": "OTP has been sent to your email"
}
```

#### Response Example (Failure - User not found):
```json
{
  "message": "User with this email does not exist"
}
```

### 2. Validate OTP

**URL:** `/auth/password/otp-validation`  
**Method:** `POST`  
**Description:** This endpoint allows a user to validate the OTP received in the email for password reset.

#### Request Body:

| Field  | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| email  | string | Yes      | The user's registered email.     |
| otp    | string | Yes      | The OTP sent to the user's email.|

#### Response Example (Success):
```json
{
  "message": "OTP is valid, you can now reset your password"
}
```

#### Response Example (Failure - Invalid or expired OTP):
```json
{
  "message": "Invalid or expired OTP"
}
```

### 3. Reset Password

**URL:** `/auth/password/reset-password`  
**Method:** `POST`  
**Description:** This endpoint allows a user to reset their password after successfully validating the OTP.

#### Request Body:

| Field       | Type   | Required | Description                     |
|-------------|--------|----------|---------------------------------|
| email       | string | Yes      | The user's registered email.     |
| newPassword | string | Yes      | The new password for the user.   |

#### Response Example (Success):
```json
{
  "message": "Password has been successfully reset"
}
```

#### Response Example (Failure - User not found):
```json
{
  "message": "User with this email does not exist"
}
```

## Error Responses
- 404: User with this email does not exist.
- 400: Invalid or expired OTP.
- 500: Server error.

---

# API Documentation - Store Management

## Authentication
This API requires JWT-based authentication. The access token must be passed via cookies in each request.
- **Authentication Method**: Cookie (`accessToken`)
- **Authorization**: Roles such as `seller` are enforced based on the route.

---

## 1. Create Store
- **Method**: POST
- **Endpoint**: `/store/create`
- **Description**: Create a new store with name, description, and logo (banner optional).
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required
- **Request Body**:
  - `name` (string, required): Name of the store
  - `description` (string, required): Description of the store
  - `logo` (file, required): Logo image file (multipart/form-data)
  - `banner` (file, optional): Banner image file (multipart/form-data)
- **Response**:
  - **201 Created**: 
    ```json
    {
      "message": "Store created successfully",
      "store": {
        "id": "store_id",
        "name": "Store Name",
        "description": "Store Description",
        "logoUrl": "https://cloudinary.com/store-logo",
        "bannerUrl": "https://cloudinary.com/store-banner",
        "owner": "owner_id"
      }
    }
    ```
  - **400 Bad Request**: If logo is not provided or required fields are missing.
  - **500 Internal Server Error**: On server issues.

---

## 2. Get Store by ID
- **Method**: GET
- **Endpoint**: `/store/:storeId`
- **Description**: Retrieve the details of a store by its ID.
- **Authentication**: Yes
- **Authorization**: Any authenticated user
- **Request Parameters**: 
  - `storeId` (string, required): The ID of the store to retrieve (path parameter)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "_id": "store_id",
      "name": "Store Name",
      "description": "Store Description",
      "logoUrl": "https://cloudinary.com/store-logo",
      "bannerUrl": "https://cloudinary.com/store-banner",
      "owner": {
        "name": "Owner Name",
        "email": "owner@example.com"
      }
    }
    ```
  - **404 Not Found**: If the store is not found.
  - **500 Internal Server Error**: On server issues.

---

## 3. Get All Stores
- **Method**: GET
- **Endpoint**: `/store/`
- **Description**: Retrieve all stores.
- **Authentication**: Yes
- **Authorization**: Any authenticated user
- **Request Parameters**: None
- **Response**:
  - **200 OK**: 
    ```json
    [
      {
        "_id": "store_id",
        "name": "Store Name",
        "description": "Store Description",
        "logoUrl": "https://cloudinary.com/store-logo",
        "bannerUrl": "https://cloudinary.com/store-banner",
        "owner": {
          "name": "Owner Name",
          "email": "owner@example.com"
        }
      },
      ...
    ]
    ```
  - **404 Not Found**: If no stores exist.
  - **500 Internal Server Error**: On server issues.

---

## 4. Update Store Profile
- **Method**: PUT
- **Endpoint**: `/store/update`
- **Description**: Update an existing store’s name, description, logo, and banner.
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required, must be the owner of the store
- **Request Body**:
  - `storeId` (string, required): ID of the store to update (path parameter)
  - `name` (string, optional): New name of the store
  - `description` (string, optional): New description of the store
  - `logo` (file, optional): New logo image file (multipart/form-data)
  - `banner` (file, optional): New banner image file (multipart/form-data)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "Store profile updated successfully",
      "store": {
        "id": "store_id",
        "name": "Updated Store Name",
        "description": "Updated Store Description",
        "logoUrl": "https://cloudinary.com/store-logo",
        "bannerUrl": "https://cloudinary.com/store-banner"
      }
    }
    ```
  - **403 Forbidden**: If the user is not authorized to update the store.
  - **404 Not Found**: If the store does not exist.
  - **500 Internal Server Error**: On server issues.

---

## Error Handling
- **400 Bad Request**: Occurs when required fields are missing or invalid data is sent.
- **403 Forbidden**: Occurs when the user does not have permission to access a resource.
- **404 Not Found**: Occurs when a requested resource (e.g., store) does not exist.
- **500 Internal Server Error**: General server errors.

---

# API Documentation - Location Sharing

## Authentication
This API requires JWT-based authentication. The access token must be passed via cookies in each request.
- **Authentication Method**: Cookie (`accessToken`)
- **Authorization**: Only users with the role `seller` are allowed to activate or deactivate location sharing.

---

## 1. Activate Location Sharing
- **Method**: POST
- **Endpoint**: `/location/activate`
- **Description**: Activates location sharing for a seller.
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required
- **Request Parameters**: None (only authentication is required)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "Location sharing activated"
    }
    ```
  - **403 Forbidden**: If the user is not authorized (e.g., not a seller).
  - **500 Internal Server Error**: On server issues.

---

## 2. Deactivate Location Sharing
- **Method**: POST
- **Endpoint**: `/location/deactivate`
- **Description**: Deactivates location sharing for a seller, and clears the current location.
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required
- **Request Parameters**: None (only authentication is required)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "Location sharing deactivated"
    }
    ```
  - **403 Forbidden**: If the user is not authorized (e.g., not a seller).
  - **500 Internal Server Error**: On server issues.

---

## Error Handling
- **403 Forbidden**: Occurs when a user without `seller` role tries to activate/deactivate location sharing.
- **500 Internal Server Error**: General server errors.

---

# API Documentation - Store Menu Management

## Authentication
This API requires JWT-based authentication. The access token must be passed via cookies in each request.
- **Authentication Method**: Cookie (`accessToken`)
- **Authorization**: Only users with the role `seller` are allowed to create, update, or delete menu items.

---

## 1. Create Menu Item
- **Method**: POST
- **Endpoint**: `/store/add-menu`
- **Description**: Creates a new menu item with name, description, price, and image.
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required
- **Request Body**:
  - `name` (string, required): Name of the menu item
  - `description` (string, required): Description of the menu item
  - `price` (number, required): Price of the menu item
  - `image` (file, required): Image of the menu item (multipart/form-data)
- **Response**:
  - **201 Created**: 
    ```json
    {
      "message": "Menu item created successfully",
      "menuItem": {
        "id": "menu_item_id",
        "name": "Item Name",
        "description": "Item Description",
        "imageUrl": "https://cloudinary.com/menu-image",
        "price": 15.99,
        "owner": "store_id"
      }
    }
    ```
  - **400 Bad Request**: If required fields (e.g., image) are missing.
  - **500 Internal Server Error**: On server issues.

---

## 2. Get Menu Items by Store
- **Method**: GET
- **Endpoint**: `/store/menus/:storeId`
- **Description**: Retrieve all menu items for a particular store.
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required
- **Request Parameters**: 
  - `storeId` (string, required): The ID of the store to retrieve the menu items for (path parameter)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "menuItems": [
        {
          "id": "menu_item_id",
          "name": "Item Name",
          "description": "Item Description",
          "imageUrl": "https://cloudinary.com/menu-image",
          "price": 15.99,
          "owner": "store_id"
        },
        ...
      ]
    }
    ```
  - **404 Not Found**: If no menu items exist for the store.
  - **500 Internal Server Error**: On server issues.

---

## 3. Update Menu Item
- **Method**: PUT
- **Endpoint**: `/store/menus/update/:menuId`
- **Description**: Updates an existing menu item with new name, description, price, or image.
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required
- **Request Body**:
  - `name` (string, optional): New name of the menu item
  - `description` (string, optional): New description of the menu item
  - `price` (number, optional): New price of the menu item
  - `image` (file, optional): New image of the menu item (multipart/form-data)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "Menu item updated successfully",
      "menuItem": {
        "id": "menu_item_id",
        "name": "Updated Item Name",
        "description": "Updated Item Description",
        "imageUrl": "https://cloudinary.com/menu-image",
        "price": 19.99,
        "owner": "store_id"
      }
    }
    ```
  - **404 Not Found**: If the menu item does not exist.
  - **500 Internal Server Error**: On server issues.

---

## 4. Delete Menu Item
- **Method**: DELETE
- **Endpoint**: `/store/menus/:menuId`
- **Description**: Deletes a specific menu item by its ID.
- **Authentication**: Yes (Seller)
- **Authorization**: Seller role required
- **Request Parameters**: 
  - `menuId` (string, required): The ID of the menu item to delete (path parameter)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "Menu item deleted successfully."
    }
    ```
  - **404 Not Found**: If the menu item does not exist.
  - **500 Internal Server Error**: On server issues.

---

## Error Handling
- **400 Bad Request**: Occurs when required fields are missing or invalid data is sent.
- **403 Forbidden**: Occurs when the user does not have permission to access a resource.
- **404 Not Found**: Occurs when a requested menu item does not exist.
- **500 Internal Server Error**: General server errors.

---

# API Documentation - Store Reviews

## Authentication
This API requires JWT-based authentication. The access token must be passed via cookies in each request.
- **Authentication Method**: Cookie (`accessToken`)
- **Authorization**: Only users with the role `buyer` are allowed to create reviews.

---

## 1. Create Review
- **Method**: POST
- **Endpoint**: `/store/:storeId/reviews`
- **Description**: Creates a new review for a specific store.
- **Authentication**: Yes (Buyer)
- **Authorization**: Buyer role required
- **Request Body**:
  - `rating` (number, required): Rating for the store (1-5 scale)
  - `comment` (string, required): Review comment for the store
  - `storeId` (string, required): ID of the store to review
- **Response**:
  - **201 Created**: 
    ```json
    {
      "message": "Review created successfully",
      "review": {
        "id": "review_id",
        "rating": 5,
        "comment": "Excellent store",
        "user": "user_id",
        "store": "store_id"
      }
    }
    ```
  - **404 Not Found**: If the store does not exist.
  - **500 Internal Server Error**: On server issues.

---

## 2. Get Store Reviews
- **Method**: GET
- **Endpoint**: `/store/:storeId/reviews`
- **Description**: Retrieves all reviews for a specific store.
- **Authentication**: No
- **Request Parameters**: 
  - `storeId` (string, required): The ID of the store to retrieve reviews for (path parameter)
- **Response**:
  - **200 OK**: 
    ```json
    [
      {
        "id": "review_id",
        "rating": 5,
        "comment": "Great store",
        "user": {
          "name": "User Name"
        },
        "store": "store_id"
      },
      ...
    ]
    ```
  - **404 Not Found**: If no reviews exist for the store.
  - **500 Internal Server Error**: On server issues.

---

## Error Handling
- **400 Bad Request**: Occurs when required fields are missing or invalid data is sent.
- **403 Forbidden**: Occurs when the user does not have permission to create a review.
- **404 Not Found**: Occurs when the store or reviews do not exist.
- **500 Internal Server Error**: General server errors.

---

# API Documentation - Favorite Stores

## Authentication
This API requires JWT-based authentication. The access token must be passed via cookies in each request.
- **Authentication Method**: Cookie (`accessToken`)
- **Authorization**: Only users with the role `buyer` are allowed to add or remove favorite stores.

---

## 1. Add Store to Favorites
- **Method**: POST
- **Endpoint**: `/favourites/add`
- **Description**: Adds a store to the user's favorite list.
- **Authentication**: Yes (Buyer)
- **Authorization**: Buyer role required
- **Request Body**:
  - `storeId` (string, required): The ID of the store to add to favorites
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "Store added to favorites",
      "favoriteStores": ["storeId_1", "storeId_2", ...]
    }
    ```
  - **400 Bad Request**: If the store is already in the user's favorites.
  - **404 Not Found**: If the store or user does not exist.
  - **500 Internal Server Error**: On server issues.

---

## 2. Remove Store from Favorites
- **Method**: POST
- **Endpoint**: `/favourites/remove`
- **Description**: Removes a store from the user's favorite list.
- **Authentication**: Yes (Buyer)
- **Authorization**: Buyer role required
- **Request Body**:
  - `storeId` (string, required): The ID of the store to remove from favorites
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "Store removed from favorites",
      "favoriteStores": ["storeId_1", "storeId_3", ...]
    }
    ```
  - **400 Bad Request**: If the store is not found in the user's favorites.
  - **404 Not Found**: If the user does not exist.
  - **500 Internal Server Error**: On server issues.

---

## Error Handling
- **400 Bad Request**: Occurs when trying to add a store that is already in favorites or remove a store that is not in favorites.
- **403 Forbidden**: Occurs when the user does not have permission to access the resource.
- **404 Not Found**: Occurs when the store or user does not exist.
- **500 Internal Server Error**: General server errors.

