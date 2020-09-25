---
layout: page
title: "PHP-SDK"
permalink: /php-sdk/
---

# Initialising
Download the required libraries to your directory using the following Composer command line:
```bash
composer require arcadier/arcadier-php
```

Find the `.env` file in the following directory created: "vendor\arcadier\arcadier-php\src" and replace the variables with the relevant values:
```
CLIENT_ID = ""
CLIENT_SECRET = ""
DOMAIN = ""
PROTOCOL = ""
```

Remember to load the SDK by including the following line in all your PHP scripts:
```php
require "vendor\arcadier\arcadier-php\src\api.php";
$sdk = new ApiSdk(); #this variable does not have to be $sdk, but in this documentation, it will be used throughout
```

## Authentication and SSO
### Single Sign On
**POST ``/api/v2/sso``**

```php
$sso_user = $sdk->ssoToken($exUserId, $userEmail);
$user_ID = $sso_user['AccessToken']['UserId'];

echo $sso_user;
```

Arguments:
* `$exUserId` - *(Required)* The user's ID from the external platform (string)
* `$userEmail` - *(Optional)* This will be registered as the new user's **notification email**

---

### Log In/Get Admin Token
**POST ``/token``**

Get Admin Token:
```php
$admin_token = $sdk->AdminToken();
echo $admin_token; 
```

Log a user in:
```php
$user = $sdk->LogIn($username, $password); //arguments: the log in credentials of the user
echo $user;
```

---

### Log Out
**POST ``/api/v2/accounts/sign-out``**
```php
$result = $sdk->LogOut($token); //$token = the authentication token of the user you wish to terminate the session of
echo $result['Result'];
```

---
## User Accounts
### Get A User's details
 
**GET** **```/api/v2/users/{userID}```**
```php 
$userInfo = $sdk->getUserInfo($id, $include);
echo $userInfo;
```

Arguments:
* `$id` - *(Required)* User GUID (string) 
* `$includes` - *(Optional)* Takes the following values (string):
  * `"addresses"` 

---
### Get All Buyers

**GET** **```/api/v2/admins/{adminID}/users/?role=buyer```**
```php 
$buyerList = $sdk->getAllBuyers($keywordsParam = null, $pageSize = null, $pageNumber = null);
echo $buyerList['Records'];
```

Arguments:
* `$keywords` - *(Optional)* Search all buyers having a certain keyword in their details (name/e-mail). (string)
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)

---
### Get All Merchants
**GET** **```/api/v2/admins/{adminID}/users/?role=merchant```**
```php
$merchantList = $sdk->getAllMerchants($keywordsParam = null, $pageSize = null, $pageNumber = null)
echo $merchantList['Records'];
```

Arguments:
* `$keywords` - *(Optional)* Search all merchants having a certain keyword in their details (name/e-mail). (string)
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)

---
### Get All Users

**GET** **```/api/v2/admins/{adminID}/users/?role=buyer```**
```php
$userList = $sdk->getAllUsers($keywordsParam = null, $pageSize = null, $pageNumber = null);
echo $userList['Records'];
```

Arguments:
* `$keywords` - *(Optional)* Search all users having a certain keyword in their details (name/e-mail). (string)
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)

---
### Create Buyer Account

**POST** **```api/v2/accounts/register```**
```php
$data = [
  'Email' => 'string', //email format
  'Password' => 'string', //at least 6 characters long
  'ConfirmPassword' => 'string' //repeat 'Password' field
];
$newUser = $sdk->registerUser($data);
echo $newUser;
``` 

---
### Update User information
**PUT** **`/api/v2/users/{userID}`**
```php 
$updatedUser = $sdk->updateUserInfo($id, $data);
echo $updatedUser;
```

Arguments:
* `$id` - *(Required)* User GUID (string)
* `$data` -  *(Optional)* If omitted, user will be unaffected.


```php
$data = [
    'Email' => 'string', 
    'FirstName' => 'string',
    'LastName' => 'string',
    'DisplayName' => 'string',
    'Description' => 'string',
    'PhoneNumber' => '',
     'Media' => [
        [
            'MediaUrl' => 'string' //URL of image
        ]
    ],
    'CustomFields' => [
        [
            'Code' => 'string',
            'Name' => 'string',
            'DataFieldType' => 'string',
            'Values' => [
                'string'
            ]
        ]
    ],
    'TimeZone' => 'string',
    'Active' => true,
    'Enabled' => true,
    'Visible' => true       
];
```

---

### Upgrade User Role
**PUT `/api/v2/admins/{adminID}/users/{userID}/roles/{role}`**
```php 
$newRole = $sdk->upgradeUserRole($id, $role);
echo $newRole;
```

Arguments:
* `$id` - *(Required)* User GUID (string)
* `$role` - *(Required)* Takes one of the following values (string)
  * "merchant"
  * "Admin"

---

### Delete User
**DELETE `/api/v2/admins/{adminID}/users/{userID}`**
```php 
$deletedUser = $sdk->deleteUser($id);
echo $deletedUser;
```

Arguments:
* `$id` - *(Required)* User GUID (string)

---

### Get Password Reset Token
**POST `/api/v2/admins/{adminID}/password`**
```php
$data = [
    'UserID': 'string', //User GUID of user to reset password for
    'Action': 'token'
];
$result = $sdk->$resetPassword($data);
echo $result['Token'];
```

---

### Update Password
**PUT `/api/v2/users/{userID}/password`** 

Arguments:
* `$userId` - *(Required)* User GUID (string)
* `$data` - *(Required)*

```php
$data = [
  'OldPassword' => 'string', //not required if resetting password
  'Password' => 'string',
  'ConfirmPassword' => 'string',
  'ResetPasswordToken' => 'string' //Obtained from Password reset API. Required if resetting password
];

$userId = "d78635hd-h7s5-k987-u4fd-333f-hd52kf6shn76";

$updatePassword = $sdk->updatePassword($data, $userId);
echo $updatePassword['Result']; 
```

---

## Addresses
### Get User Address
**GET ``/api/v2/users/{userID}/addresses/{addressID}``** is mapped to `getUserAddress($id,  $addressID)`

Arguments:
* `$id` - *(Required)* User GUID (string)
* `$addressID` - *(Optional)* Address GUID (string). Ommitting it will return all addresses of that user.

---

### Create User Address
**POST ``/api/v2/users/{userID}/addresses``** is mapped to `createUserAddress($id, $data)`

Arguments:
* `$id` - *(Required)* User GUID (string)
* `$data` - *(Required)*

```php
$data = [
    'Name' => 'string',
    'Line1' => 'string',
    'Line2' => 'string',
    'PostCode' => 'string',
    'Latitude' => 'string',
    'Longitude' => 'string',
    'Delivery' => true,
    'Pickup' => true,
    'SpecialInstructions' => 'string',
    'State' => 'string',
    'City' => 'string',
    'Country' => 'string', //required
    'CountryCode' => 'string' //required
];
```

---

### Update User Address
**PUT ``/api/v2/users/{userID}/addresses/{addressID}``** is mapped to `updateUserAddress($id, $addressID, $data)`

Arguments:
* `$id` - *(Required)* User GUID (string)
* `$addressID` - *(Required)* Address GUID (string)
* `$data` - *(Required)*

```php
$data = [
    'Name' => 'string',
    'Line1' => 'string',
    'Line2' => 'string',
    'PostCode' => 'string',
    'Latitude' => 'string',
    'Longitude' => 'string',
    'Delivery' => true,
    'Pickup' => true,
    'SpecialInstructions' => 'string',
    'State' => 'string',
    'City' => 'string',
    'Country' => 'string', //required
    'CountryCode' => 'string' //required
];
```

---

### Delete User Address
**DELETE ``/api/v2/users/{userID}/addresses/{addressID}``** is mapped to `deleteUserAddress($id, $addressID)`

Arguments:
* `$id` - *(Required)* User GUID (string)
* `$addressID` - *(Optional)* Address GUID (string). Ommitting it will return all addresses of that user.

---

## Items
### Get Item Information
**GET ``/api/v2/items/{itemID}``** is mapped to `getItemInfo($id)`

Arguments:
* `$id` - *(Required)* Item GUID (string)

---

### Get All Items
**GET** **```/api/v2/items```** is mapped to `getAllItems($pageSize = null, $pageNumber = null);`

Arguments:
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)

```php
$item_list = $sdk->getAllItems();
echo $item_list['Records']; //The actual array of items is in the "Records" field of the JSON response
```

---

### Search for an item

**POST** **```/api/v2/items```** is mapped to `searchItems($data);`

Search filters are passed to the function as an object:
```php
$data = [
    'keywords' => 'string', //keyword in item name, description, or custom field
    'pagesize' => 'string', //number of results
    'Categories' =>[
        'string' //Category GUID
    ],
    'sellerID' => 'string', //merchant GUID
    'customFields' => 'string', 
	'tax' => 'string',
	'minPrice' => 0,
	'maxPrice' => 0,
	'minRating' => 0,
	'maxRating' => 0,
	'startDate' => 'unix_time',
	'endDate' => 'unix_time',
	'createdStartDate' => 'unix_time',
	'createdEndDate' => 'unix_time',
	'updatedStartDate' => 'unix_time',
	'updatedEndDate' => 'unix_time'
];

$response = $sdk->getAllItemsJsonFiltering($data);
$results = $response['Records']; //The actual array of matching items is in the "Records" field of the JSON response
```

---

### Create Item
**POST ``/api/v2/merchants/{merchantID}/items``** is mapped to `createItem($data, $merchantId)`

Arguments:
* `$merchantId` - *(Required)* Merchant GUID (string)
* `$data` - Item details (Object)

```php
$data = [
    'SKU' => 'string',
    'Name' => 'string', //required
    'BuyerDescription' => 'string', //required
    'SellerDescription' => 'string', //required
    'Price' => 0, //required
    'PriceUnit' => 'string', //required
    'StockLimited' => true, //required
    'StockQuantity' => 0, //can be ommitted if StockLimited is set to false
    'IsVisibleToCustomer' => true,
    'Active' => true,
    'IsAvailable' => true,
    'CurrencyCode' => 'string', //required
    'Categories' => [
        [
            'ID' => 'string' //Category GUID. Required
        ]
    ],
    'ShippingMethods' => [ 
        [
            'ID' => 'string' //Shipping method GUID
        ]
    ],
    'PickupAddresses' => [
        [
            'ID' => 'string' //Address GUID
        ]
    ],
    'Media' => [
        [
            'MediaUrl' => 'string' //URL of image. Required
        ]
    ],
    'Tags' => [
        'string'
    ],
    'CustomFields' => [
        [
            'Code' => 'string', //Custom field code
            'Values' => [
                'string'
            ]
        ]
    ],
    'HasChildItems' => false,
    'ChildItems' => [ //this whole object can be omitted if HasChildItems is set to false
        [
            'Variants' => [
                [
                    'Name' => 'string',
                    'GroupName' => 'string2'
                ]
            ],
            'SKU' => 'string',
            'Name' => 'string',
            'BuyerDescription' => 'string',
            'SellerDescription' => 'string',
            'Price' => 0,
            'PriceUnit' => 'string',
            'StockLimited' => true,
            'StockQuantity' => 0,
            'IsVisibleToCustomer' => true,
            'Active' => true,
            'IsAvailable' => true,
            'CurrencyCode' => 'string',
            'Categories' => [
                [
                    'ID' => 'string'
                ]
            ],
            'ShippingMethods' => [
                [
                    'ID' => 'string'
                ]
            ],
            'PickupAddresses' => [
                [
                    'ID' => 'string'
                ]
            ],
            'Media' => [
                [
                    'MediaUrl' => 'string'
                ]
            ],
            'Tags' => [
                'string'
            ]
        ]
    ]
]
```

---
### Create Listing/Booking
**POST ``/api/v2/merchants/{merchantID}/items``** is mapped to `createItem($data, $merchantId)`

Arguments:
* `$merchantId` - *(Required)* Merchant GUID (string)
* `$data` - Item details (Object)

Documentation and `$data` details can be found [here](https://apiv2.arcadier.com/#b3c71583-e9e5-4afc-8061-2705113bf571).

Fields similar to `Create Item` have the same requirement.
```php
$data = [
    'SKU' => 'string',
    'Name' => 'string',
    'BuyerDescription' => 'string',
    'SellerDescription' => 'string',
    'Price' => 0,
    'PriceUnit' => 'string',
    'StockLimited' => true,
    'StockQuantity' => 0,
    'IsVisibleToCustomer' => true,
    'Active' => true,
    'IsAvailable' => true,
    'CurrencyCode' => 'string',
    'InstantBuy' => true,
    'Negotiation' => false,
    'Categories' => [
        [
            'ID' => 'string'
        ]
    ],
    'ShippingMethods' => [
        [
            'ID' => 'string'
        ]
    ],
    'PickupAddresses' => [
        [
            'ID' => 'string'
        ]
    ],
    'Media' => [
        [
            'MediaUrl' => 'string'
        ]
    ],
    'Tags' => [
        'string'
    ],
    'CustomFields' => [
        [
            'Code' => 'string',
            'Values' => [
                'string'
            ]
        ]
    ],
    'Scheduler' => [
        'TimeZoneOffset' => -12.00,
        'TimeZoneID' => 1,
        'AllDay' => false,
        'Overnight' => false,
        'StartDateTime' => 1584748800,
        'EndDateTime' => 1587427200,
        'OpeningHours' => [
        	[
        		'Day' => 1,
        		'StartTime' => '08:00:00',
        		'EndTime' => '21:00:00',
        		'IsRestDay' => false
        	],
        	[
        		'Day' => 2,
        		'StartTime' => '08:00:00',
        		'EndTime' => '21:00:00',
        		'IsRestDay' => false
        	],
        	[
        		'Day' => 3,
        		'StartTime' => '08:00:00',
        		'EndTime' => '21:00:00',
        		'IsRestDay' => false
        	],
        	[
        		'Day' => 4,
        		'StartTime' => '08:00:00',
        		'EndTime' => '21:00:00',
        		'IsRestDay' => false
        	],
        	[
        		'Day' => 5,
        		'StartTime' => '08:00:00',
        		'EndTime' => '21:00:00',
        		'IsRestDay' => true
        	],
        	[
        		'Day' => 6,
        		'StartTime' => '18:00:00',
        		'EndTime' => '23:00:00',
        		'IsRestDay' => true
        	],
        	[
        		'Day' => 7,
        		'StartTime' => '08:00:00',
        		'EndTime' => '22:00:00',
        		'IsRestDay' => true
        	]
        ],
        'Unavailables' => [
        	[
        		'StartDateTime' => 1585094400,
        		'EndDateTime' => 1585180800,
        		'Reason' => 'My Birthday',
        		'Active' => true
        	],
        	[
        		'StartDateTime' => 1587081600,
        		'EndDateTime' => 1587222000,
        		'Reason' => 'Your Birthday',
        		'Active' => true
        	]
        ]
    ],
    'HasChildItems' => true,
    'ChildItems' => [
        [
            'Variants' => [
                [
                    'Name' => 'string',
                    'GroupName' => 'string2'
                ]
            ],
            'SKU' => 'string',
            'Name' => 'string',
            'BuyerDescription' => 'string',
            'SellerDescription' => 'string',
            'Price' => 0,
            'PriceUnit' => 'string',
            'StockLimited' => true,
            'StockQuantity' => 0,
            'IsVisibleToCustomer' => true,
            'Active' => true,
            'IsAvailable' => true,
            'CurrencyCode' => 'string',
            'Categories' => [
                [
                    'ID' => 'string'
                ]
            ],
            'ShippingMethods' => [
                [
                    'ID' => 'string'
                ]
            ],
            'PickupAddresses' => [
                [
                    'ID' => 'string'
                ]
            ],
            'Media' => [
                [
                    'MediaUrl' => 'string'
                ]
            ],
            'Tags' => [
                'string'
            ]
        ]
    ]
]
```

---
### Edit Item/Listing/Booking
**PUT ``/api/v2/merchants/{merchantID}/items/{itemID}``** is mapped to `editItem($data, $merchantId, $itemId)`

Arguments:
* `$merchantId` - *(Required)* Merchant GUID (string)
* `$itemId` - *(Required)* Item GUID (string)
* `$data` - Item details (Object)

Documentation and `$data` details can be found [here](https://apiv2.arcadier.com/#8af9bf27-a3fb-4623-b8d0-f53a67697c47).

---
### Delete Item/Listing/Booking
**DELETE ``/api/v2/merchants/{merchantID}/items/{itemID}``** is mapped to `deleteItem($merchantId, $itemId)`

Arguments:
* `$merchantId` - *(Required)* Merchant GUID (string)
* `$itemId` - *(Required)* Item GUID (string)

---
### Tag Item/Listing/Booking
**POST ``/api/v2/merchants/{merchantID}/items/{itemID}/tags``** is mapped to `tagItem($data, $merchantId, $itemId)`

Arguments:
* `$merchantId` - *(Required)* Merchant GUID (string)
* `$itemId` - *(Required)* Item GUID (string)
* `$data` - Item details (Array of strings)

```php
$data = [
    'string',
    'string'
];
```

---
### Get Item Tags
**GET ``/api/v2/tags``** is mapped to `getItemTags($pageSize = null, $pageNumber = null)`

Arguments:
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)

More about pagination [here](https://apiv2.arcadier.com/#pagination)

---
### Delete Item Tags
**DELETE ``/api/v2/tags``** is mapped to `deleteTags($data)`

```php
$data = [
    'string_1',
    'string_2'
];
```

---

## Cart
### Get Buyer's Cart
**GET ``/api/v2/users/{buyerID}/carts``**

```php
$cart = $sdk->getCart($buyerId);
echo $cart['Records'];
```
Arguments:
* `$buyerId` - *(Required)* The buyer's GUID (string)

---

### Add Item to Cart
**POST ``/api/v2/users/{buyerID}/carts``**

Arguments:
* `$buyerId` - *(Required)* The buyer's GUID (string)
* `$data`:
```php
$data = [
    'ItemDetail'=> [
        'ID'=> '00000000-0000-0000-0000-000000000000' // Required. String. Item GUID. If an item has child items, this will be the child item GUID.
    ],
    'Quantity'=> 0, //integer. Required
    'CartItemType'=> 'delivery', //optional
    'ShippingMethod'=> [
        'ID'=> '00000000-0000-0000-0000-000000000000' //optional. Shipping Method GUID 
    ]
];

$cart = $sdk->addToCart($data, $buyerId);
echo $cart;
```

---

### Edit Item in Cart
**PUT ``/api/v2/users/{buyerID}/carts/{cart-item-ID}``**

Arguments:
* `$buyerId` - *(Required)* The buyer's GUID (string)'=
* `$cartItemId` - *(Required)* The Cart Item ID obtained from the response of **Add item to Cart** API
* `$data`:
```php
$data = [
    'ItemDetail'=> [
        'ID'=> '00000000-0000-0000-0000-000000000000' // Required. String. Item GUID. If an item has child items, this will be the child item GUID.
    ],
    'Quantity'=> 0, //integer. Required
    'CartItemType'=> 'delivery', //optional
    'ShippingMethod'=> [
        'ID'=> '00000000-0000-0000-0000-000000000000' //optional. Shipping Method GUID 
    ]
];

$cart = $sdk->updateCartItem($data, $buyerId, $cartItemId);
echo $cart;
```

---
### Delete Item from Cart
**DELETE ``/api/v2/users/{buyerID}/carts/{cart-item-ID}``**

Arguments:
* `$buyerId` - *(Required)* The buyer's GUID (string)'=
* `$cartItemId` - *(Required)* The Cart Item ID obtained from the response of **Add item to Cart** API

```php
$cart = $sdk->deleteCartItem($buyerId, $cartItemId);
echo $cart;
```

---

## Orders
### Get Order by Order GUID
**GET ``/api/v2/users/{merchantID}/orders/{orderID}``**

```php
$orderInfo = $sdk->getOrder($id, $userId);
echo $orderInfo;
```
Arguments:
* `$id` - *(Required)* The order GUID (string)
* `userId` - *(Required)* Can be either the Admin GUID or the merchant GUID of the the merchant who owns the order.

---

### Get All Orders of a merchant
**GET ``/api/v2/users/{merchantID}/orders/{orderID}``**

```php
$orderList = $sdk->getOrderHistory($merchantId, $pageSize, $pageNumber);
echo $orderList;
```
Arguments:
* `$merchantId` - *(Required)* The merchant GUID (string)
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)

---

### Get All Orders within an Invoice
**GET ``/api/v2/merchants/{merchantID}/transactions/{invoiceID}``**

```php
$orderList = $sdk->getOrderInfoByInvoiceId($merchantId, $invoiceId);
echo $orderList;
```
Arguments:
* `$merchantId` - *(Required)* The merchant GUID (string)
* `$invoiceId` - *(Required)* The invoice number (string)

---

### Update An Order
**POST ``/api/v2/merchants/{merchantID}/orders/{orderID}``**

```php
$data = [
    'FulfilmentStatus'=> 'string',
    'PaymentStatus'=> 'string',
    'Balance'=> 0,
    'DeliveryToAddress'=> [
        'ID'=> '00000000-0000-0000-0000-000000000000'
    ],
    'CartItemType'=> 'string',
    'Freight'=> 0,
    'DiscountAmount'=> 0,
    'Surcharge'=> 0,
    'CustomFields'=> [
        [
            'Code'=> 'string',
            'Values'=> [
            	'string'
            ]
        ]
    ]
];

$updated_order = $sdk->editOrder($merchantId, $orderId, $data)
echo $updated_order;
```

Arguments:
* `$merchantId` - the GUID of the merchant who is the owner of the order. This can also be the Admin GUID (string)
* `$orderId` - The order GUID (string)
* `$data`

Field Definitions for `$data` can be found [here](https://apiv2.arcadier.com/#5b14eb44-8967-480e-82ea-166378754b2b).

### Edit Several Orders' Details
**POST ``/api/v2/admins/{adminID}/orders``**
```php
$data = [
    [ //order #1
        'ID' => '00000000-0000-0000-0000-000000000000',
        'FulfilmentStatus'=> 'string',
        'PaymentStatus'=> 'string',
        'Balance'=> 0,
        'DeliveryToAddress'=> [
            'ID'=> '00000000-0000-0000-0000-000000000000'
        ],
        'CartItemType'=> 'string',
        'Freight'=> 0,
        'DiscountAmount'=> 0,
        'Surcharge'=> 0,
        'CustomFields'=> [
            [
                'Code'=> 'string',
                'Values'=> [
                    'string'
                ]
            ]
        ]
    ],
    [ //order #2
        'ID' => '00000000-0000-0000-0000-000000000000',
        'FulfilmentStatus'=> 'string',
        'PaymentStatus'=> 'string',
        'Balance'=> 0,
        'DeliveryToAddress'=> [
            'ID'=> '00000000-0000-0000-0000-000000000000'
        ],
        'CartItemType'=> 'string',
        'Freight'=> 0,
        'DiscountAmount'=> 0,
        'Surcharge'=> 0,
        'CustomFields'=> [
            [
                'Code'=> 'string',
                'Values'=> [
                    'string'
                ]
            ]
        ]
    ]
];

$updated_orders = $sdk->updateOrders($data)
echo $updated_orders;
```

Field Definitions for `$data` can be found [here](https://apiv2.arcadier.com/#02990d95-cb5f-4040-9965-a88bcb342c1c).


---

## Transactions
### Get Transaction Info by Invoice number
**GET ``/api/v2/admins/{adminID}/transactions/{invoiceID}``**

```php
$transac_info = $sdk->getTransactionInfo($invoiceNo);
echo $transac_info;
```
Arguments:
* `$invoiceNo` - *(Required)* The invoice number (string)

---

### Get all Transactions of marketplace
**GET ``/api/v2/admins/{adminID}/transactions``**

```php
$transactions = $sdk->getAllTransactions($startDate = null, $endDate = null, $pageSize = null, $pageNumber = null);
echo $transactions['Records'];
```

Arguments:
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)
* `$startDate` - *(Optional)* The lower limit of the time at which you want to start filtering. (integer - Unix timestamp)
* `$endDate` - *(Optional)* The upper limit of the time at which you want to end filetering. (integer - Unix timestamp)

---

### Get all Transactions of a Buyer
**GET ``/api/v2/users/{buyerID}/transactions``**

```php
$transactions = $sdk->getBuyerTransactions($buyerId);
echo $transactions['Records'];
```
Arguments:
* `$buyerId` - *(Required)* The buyer GUID (string)

---

### Update Array of Transaction's Details
**PUT ``/api/v2/admins/{adminID}/invoices/{invoiceID}``**

```php
$data = [
  [
    'Payee' => [
      'ID' => '00000000-0000-0000-0000-000000000000'
    ],
    'Order' => [
      'ID' => '00000000-0000-0000-0000-000000000000'
    ],
    'Total' => 0,
    'Fee' => 0,
    'Status' => 'string',
    'Refunded' => false,
    'RefundedRef' => 'string',
    'GatewayPayKey' => 'string',
    'GatewayTransactionID' => 'string',
    'GatewayStatus' => 'string',
    'GatewayTimeStamp' => 'string',
    'GatewayRef' => 'string',
    'GatewayCorrelationId' => 'string',
    'GatewaySenderId' => 'string',
    'GatewaySenderRef' => 'string',
    'GatewayReceiverId' => 'string',
    'GatewayReceiverRef' => 'string',
    'Gateway' => [
      'Code' => 'string'
    ],
    'DateTimePaid' => 0
  ]
];

$updated_transaction = $sdk->updateTransaction($invoiceNo, $data);
echo $updated_transaction;
```

Arguments:
* `$invoiceNo` - the invoice number of the invoice to be updated
* `$data`

Field Definitions for `$data` can be found [here](https://apiv2.arcadier.com/#68a1094c-77b6-45fb-acc2-aec053d94a28).

---

---

## Custom Tables
### Get Custom Table Contents
**GET ``api/v2/plugins/{packageID}/custom-tables/{custom-table-name}/``**

```php
$custom_table = $sdk->getCustomTable($packageId, $tableName);
echo $custom_table['Records'];
```

Arguments:
* `$packageId` - *(Required)* The Plug-In ID (string)
* `$tableName` - *(Required)* The table name (string)

---

### Create Row 
**POST ``/api/v2/plugins/{packageID}/custom-tables/{custom-table-name}/rows``**

```php
$data = [
    `{column-name1}` => `string`, // data type depends on what was configured during custom table creation
    `{column-name2}` => 0
];

$new_row = $sdk->createRowEntry($packageId, $tableName, $data);
echo $new_row;
```
Arguments:
* `$packageId` - *(Required)* The Plug-In ID (string)
* `$tableName` - *(Required)* The table name (string)

---

### Update Row 
**PUT ``/api/v2/plugins/{packageID}/custom-tables/{custom-table-name}/rows/{rowId}``**

```php
$data = [
    "{column-name1}": "string", // data type depends on what was configured during custom table creation
    "{column-name2}": 0
];

$updated_row = $sdk->editRowEntry($packageId, $tableName, $rowId, $data);
echo $update_row;
```
Arguments:
* `$packageId` - *(Required)* The Plug-In ID (string)
* `$tableName` - *(Required)* The table name (string)
* `$rowId` - *(Required)* The ID of the row (string)

---

### Delete Row 
**DELETE ``/api/v2/plugins/{packageID}/custom-tables/{custom-table-name}/rows/{rowId}``**

```php
$deleted_row = $sdk->deleteRowEntry($packageId, $tableName, $rowId);
echo $deleted_row;
```
Arguments:
* `$packageId` - *(Required)* The Plug-In ID (string)
* `$tableName` - *(Required)* The table name (string)
* `$rowId` - *(Required)* The ID of the row (string)

---

## Event Triggers
### Get Event Triggers
**GET ``/api/v2/event-triggers/``**

```php
$event_trigger_list = $sdk->getEventTriggers();
echo $event_trigger_list;
```

---

### Create Event Trigger
**POST ``/api/v2/event-triggers/``**

```php
$data = [
    'Uri' => 'string',  //required
    'Filters' => [      //required
        'string', 
        'string'
    ],
    'Description' => 'string',
    'IsPaused' => false,
    'Headers' => [
        'Authorization' => 'string',
        'CustomHeader' => 'string',
        'Alice' => 'Bob'
    ]
];

$new_event_trigger = $sdk->addEventTrigger($data);
echo $new_event_trigger;
```

Field definitions:
* `'Uri'` - The URL of the webhook to send the payload to.
* `'Filters' => []` - Array of names of the events which act as trigger. More details [here](https://apiv2.arcadier.com/#cda751b9-e7a4-4d50-b660-72ec9cd4d4f0).
* `'Description'` - Short description of the event trigger
* `'IsPaused'` - (Boolean) Halts the triggering of this event to the specified URI. This does not delete the event trigger.
* `'Headers' => []` - Array of headers paramaters you wish to send with the payload to the webhook server.

### Edit Event Trigger
**PUT ``/api/v2/event-triggers/{event_trigger_ID}``**

```php
$data = [
    'Uri' => 'string',  //required
    'Filters' => [      //required
        'string', 
        'string'
    ],
    'Description' => 'string',
    'IsPaused' => false,
    'Headers' => [
        'Authorization' => 'string',
        'CustomHeader' => 'string',
        'Alice' => 'Bob'
    ]
];

$edit_event_trigger = $sdk->updateEventTrigger($eventTriggerId, $data);
echo $edit_event_trigger;
```
Arguments:
* `$eventTriggerId` - the ID of the event trigger obtained after creating it (string)
* `$data`:

Field definitions:
* `'Uri'` - The URL of the webhook to send the payload to.
* `'Filters' => []` - Array of names of the events which act as trigger. More details [here](https://apiv2.arcadier.com/#cda751b9-e7a4-4d50-b660-72ec9cd4d4f0).
* `'Description'` - Short description of the event trigger
* `'IsPaused'` - (Boolean) Halts the triggering of this event to the specified URI. This does not delete the event trigger.
* `'Headers' => []` - Array of headers paramaters you wish to send with the payload to the webhook server.

---

### Delete Event Trigger
**DELETE ``/api/v2/event-triggers/{event_trigger_ID}``**

```php
$delete_event_trigger = $sdk->removeEventTrigger($eventTriggerId);
echo $delete_event_trigger;
```
Arguments:
* `$eventTriggerId` - the ID of the event trigger obtained after creating it (string)

---

## E-Mail
### Send Email
**POST ``/api/v2/admins/{adminID}/emails``**

```php
$data= [
    'From' => 'string',
    'To' => 'string',
    'Body' => 'Your email content. It can be in plaintext or in HTML',
    'Subject' => 'string'
];

$sendEmail = $sdk->sendEmail($from, $to, $html, $subject);
echo $sendEmail;
```

Argurments:
* `$from` - The sender's email (string)
* `$to` - The recipient's email (string)
* `$html` - Stringified HTML content of the email
* `$subject` - The subject of the email (string)

---

### Send Email for Invoice number
**POST ``/api/v2/emails``**

```php
$sendEmail = $sdk->sendEmailAfterGeneratingInvoice($invoiceNo);
echo $sendEmail;
``` 

Arguments:
* `$invoiceno` - The invoice number (string)

---

## Static
### Get Fulfilment Statuses
**GET ``/api/v2/static/fulfilment-statuses``**
```php
$fulfilment_statuses = $sdk->getFulfilmentStatuses();
echo $fulfilment_statuses['Records'];
```

---

### Get Currencies
**GET ``/api/v2/static/currencies``**
```php
$currencies = $sdk->getCurrencies();
echo $currencies['Records'];
```

---

### Get Countries
**GET ``/api/v2/static/countries``**
```php
$countries = $sdk->getCountries();
echo $countries['Records'];
```

---

### Get Order Statuses
**GET ``/api/v2/static/order-statuses``**
```php
$order_statuses = $sdk->getOrderStatuses();
echo $order_statuses['Records'];
```

---

### Get Payment Statuses
**GET ``/api/v2/static/payment-statuses``**
```php
$payment_statuses = $sdk->getPaymentStatuses();
echo $payment_statuses['Records'];
```

---

### Get TimeZones
**GET ``/api/v2/static/timezones``**
```php
$timezones = $sdk->getTimezones();
echo $timezones['Records'];
```

---

## Categories
### Get Category List
**GET ``/api/v2/categories``**

```php
$category_list = $sdk->getCategories($pageSize = null, $pageNumber = null);
echo $category_list['Records'];
```

Arguments:
* `$pageSize` - *(Optional)* The number of results in one response. (integer)
* `$pageNumber` - *(Optional)* Depending on `pageSize` and the total number of results, specifying this will display different sets of results. (integer)

---

### Get Category Hierarchy
**GET ``/api/v2/categories/hierarchy``**

```php
$category_hierarchy = $sdk->getCategoriesWithHierarchy();
echo $category_hierarchy;
```

---

### Create a Category
**POST ``/api/v2/admins/{adminID}/categories``**

```php
$data = [
    'Name' => 'string', //required
    'Description' => 'string',
    'SortOrder' => 0,
    'Media' => [ //required
        [
            'MediaUrl' => 'string'
        ]
    ],
    'ParentCategoryID' => '00000000-0000-0000-0000-000000000000',
    'Level' => 0
];

$new_category = $sdk->createCategory($data);
echo $new_category;
```

Field definitions:
* `'Name'` - Name of the category
* `'Description'` - Short Description of the category
* `'SortOrder'` - Rank in which it will appear on category lists
* `'Media' => [ 'MediaUrl']` - The URL of the image to be set for the category
* `'ParentCategoryID'` - The GUID of the category which will be the parent of this new category. Omit this field if the category is going to be a parent/main category
* `'Level'` - Parent Categories have a level of `0`. subsequent levels of child categories have higher levels.

---

### Edit a Category
**PUT ``/api/v2/admins/{adminID}/categories/{categoryID}``**

```php
$data = [
    'Name' => 'string', 
    'Description' => 'string',
    'SortOrder' => 0,
    'Media' => [ 
        [
            'MediaUrl' => 'string'
        ]
    ],
    'ParentCategoryID' => '00000000-0000-0000-0000-000000000000',
    'Level' => 0
];

$edited_category = $sdk->updateCategory($categoryId, $data);
echo $edited_category;
```

Arguments:
* `$categoryId` - the category GUID of the category to edit
* `$data`

Field definitions:
* `'Name'` - Name of the category
* `'Description'` - Short Description of the category
* `'SortOrder'` - Rank in which it will appear on category lists
* `'Media' => [ 'MediaUrl']` - The URL of the image to be set for the category
* `'ParentCategoryID'` - The GUID of the category which will be the parent of this new category. Omit this field if the category is going to be a parent/main category
* `'Level'` - Parent Categories have a level of `0`. subsequent levels of child categories have higher levels.

---

### Sort Categories
**PUT ``/api/v2/admins/{adminID}/categories``**

```php
$data = [
    "Category GUID #1", //string
    "Category GUID #2",
    "Category GUID #3"
];

$sorted_list = $sdk->sortCategories($data);
echo $sorted_list;
```

---

### Delete a Category
**DELETE ``/api/v2/admins/{adminID}/categories/{categoryID}``**
```php
$deleted_category = $sdk->deleteCategory($categoryId);
echo $deleted_category;
```

Arguments:
* `$categoryId` - the category GUID of the category to edit

---

## Marketplace
### Get Marketplace Info
**GET ``/api/v2/marketplaces/``**

```php
$mp = $sdk->getMarketplaceInfo();
echo $mp;
```

---

### Update Marketplace Info
**POST ``/api/v2/marketplaces/``**

```php
$data = [
   'CustomFields' => [
        [
            'Code' => 'string', //the custom field code of an existing custom field
            'Values' => [
                'string' //the value to store. Data type depends on what was configured when the custom field was created.
            ]
        ]
    ]
];

$updated_mp = $sdk->updateMarketplaceInfo($data);
echo $updated_mp;
```

### Customize/Shorten URL
**POST ``/api/v2/rewrite-rules``**

```php
$data = [
    'Key' => 'string',
    'Value' => 'string'
];

$res = $sdk->customiseURL($data)
echo $res;
```

Field Definitions:
* `'Key'` - The custom URL slug
* `'Value'` - The default URL slug to replace

---

## Shipping/Delivery
### Get Shipping Methods
**GET ``/api/v2/merchants/{merchantID}/shipping-methods/``**

```php
$shipping_methods = $sdk->getShippingMethods($merchantId);
echo $shipping_methods;
```

### Get Delivery Rates (Weight/Price)
**GET ``/api/v2/merchants/{adminID}/shipping-methods/``**

```php
$delivery_rates = $sdk->getDeliveryRates();
echo $delivery_rates;

```

### Create Shipping Method/Delivery Rate
**POST ``/api/v2/merchants/{merchantID}/shipping-methods``**

```php
$data = [
	'Courier' => 'string',
	'Price' => 0, //required
	'CombinedPrice' => 0, 
	'CurrencyCode' => 'string', //required
	'Description' => 'string'
];
$new_shipping = $sdk->createShippingMethod($merchantId, $data);
echo $new_shipping;
```

Arguments:
* `$merchantId` - The merchant's GUID (string)
* `$data`

Field Definitions:
* `'Courier'` - The shipping method name
* `'Price'` and `'CombinedPrice'` - Detailed explanations of how to use these 2 fields together is explained [here](https://apiv2.arcadier.com/#4fc81ed1-97b5-45ce-b1e9-51fee0a9916e).
* `'CurrencyCode'` -  The currency in which the shipping method operates, eg: USD or SGD
* `'Description'` - Short description of the shipping method.

---

### Edit Shipping Method/Delivery Rate
**PUT ``/api/v2/merchants/{merchantID}/shipping-methods/{shippingmethodID}``**

```php
$data = [
	'Courier' => 'string',
	'Price' => 0, //required
	'CombinedPrice' => 0, 
	'CurrencyCode' => 'string', //required
	'Description' => 'string'
];
$edited_shipping = $sdk->updateShippingMethod($merchantId, $shippingMethodId, $data)
echo $edited_shipping;
```

Arguments:
* `$merchantId` - The merchant's GUID (string)
* `$shippingMethodId` - The shipping GUID to be edited (string)
* `$data`

Field Definitions:
* `'Courier'` - The shipping method name
* `'Price'` and `'CombinedPrice'` - Detailed explanations of how to use these 2 fields together is explained [here](https://apiv2.arcadier.com/#4fc81ed1-97b5-45ce-b1e9-51fee0a9916e).
* `'CurrencyCode'` -  The currency in which the shipping method operates, eg: USD or SGD
* `'Description'` - Short description of the shipping method.

---

### Delete Shipping Method/Delivery Rate
**DELETE ``/api/v2/merchants/{merchantID}/shipping-methods/{shippingmethodID}``**

```php
$deleted_shipping = $sdk->deleteShippingMethod($merchantId, $shippingMethodId);
echo $deleted_shipping;
```

Arguments:
* `$merchantId` - The merchant's GUID (string)
* `$shippingMethodId` - The shipping GUID to be deleted (string)

---

## Custom Fields
### Get Custom Field Definitions
**GET ``/api/v2/admins/{adminID}/custom-field-definitions/``**

```php
$cf = $sdk->getCustomFields()
echo $cf['Records'];
```

--- 

### Get Custom Fields of a Plug-In
**GET ``/api/v2/packages/{packageID}/custom-field-definitions``**

```php
$plugin_cf = $sdk->getPluginCustomFields($packageId);
echo $plugin_cf;
```

Arguments:
* `$packageId` - The ID of the Plug-In (string)

---

### Create A Custom Field
**POST ``/api/v2/admins/{adminID}/custom-field-definitions``**

```php
$data = [
  'Name' => 'string',
  'IsMandatory' => true,
  'SortOrder' => 0,
  'DataInputType' => 'string',
  'DataRegex' => 'string',
  'MinValue' => 0,
  'MaxValue' => 0,
  'ReferenceTable' => 'string',
  'DataFieldType' => 'string',
  'IsSearchable' => true,
  'IsSensitive' => true,
  'Active' => true,
  'Options' => [
    [
      'Name' => 'string'
    ]
  ]
];

$new_cf = $sdk->createCustomField($data);
echo $new_cf;
```

Field Definitions for `$data`: All the field definitions for this request can be found [here](https://github.com/Arcadier/Coding-Tutorials/tree/master/Creating%20Custom%20Fields).

---

### Edit A Custom Field
**PUT ``/api/v2/admins/{adminID}/custom-field-definitions/{customfield-code}``**

```php
$data = [
  'Name' => 'string',
  'IsMandatory' => true,
  'SortOrder' => 0,
  'DataInputType' => 'string',
  'DataRegex' => 'string',
  'MinValue' => 0,
  'MaxValue' => 0,
  'ReferenceTable' => 'string',
  'DataFieldType' => 'string',
  'IsSearchable' => true,
  'IsSensitive' => true,
  'Active' => true,
  'Options' => [
    [
      'Name' => 'string'
    ]
  ]
];

$updated_cf = $sdk->updateCustomField($code, $data)
echo $updated_cf;
```

Arguments:
* `$code` - The custom field code obtained after creating it/getting its definition

Field Definitions for `$data`: All the field definitions for this request can be found [here](https://github.com/Arcadier/Coding-Tutorials/tree/master/Creating%20Custom%20Fields).

---

### Delete A Custom Field
**DELETE ``/api/v2/admins/{adminID}/custom-field-definitions/{custom-field-code}``**

```php
$deleted_cf = $sdk->deleteCustomField($code);
echo $deleted_cf;
```

Arguments:
* `$code` - The custom field code obtained after creating it/getting its definition

---

## Checkout
### Generate Invoice and Order Details from cart
**POST ``/api/v2/users/{buyerID}/invoices/carts``**

```php
$data = [
    'Cart Item ID #1', //the cart item ID
    'Cart Item ID #2',
    'Cart Item ID #3'
];

$generate_details = $sdk->generateInvoice($buyerId, $data);
echo $generate_details;
```

Arguments:
* `$buyerID` - The BUyer's GUID (string)
* `$data`

Field Definitions in `$data`: the difference between an "item ID" and a "cart item ID" is explained [here](https://apiv2.arcadier.com/#4b0bc4da-201c-472e-8deb-1a2e1099f908)

---