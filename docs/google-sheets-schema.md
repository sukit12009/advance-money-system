# Google Sheets Schema

## transactions

| Column | Type | Notes |
| --- | --- | --- |
| id | string | Permanent ID, not a row number |
| date | YYYY-MM-DD | Used for running balance order |
| type | income \| expense | Determines add/subtract behavior |
| operationDate | string | Human-friendly operation date |
| description | string | Transaction description |
| categoryId | string | Must match category type |
| amount | number | Always positive |
| paymentTypeId | string | Active payment/document type |
| received | boolean | Money received status |
| note | string | Optional |
| createdAt | ISO datetime | Audit field |
| updatedAt | ISO datetime | Audit field |
| createdBy | string | Audit field |
| updatedBy | string | Audit field |

## categories

| Column | Type |
| --- | --- |
| id | string |
| name | string |
| type | income \| expense |
| active | boolean |
| sortOrder | number |

## payment_types

| Column | Type |
| --- | --- |
| id | string |
| name | string |
| active | boolean |
| sortOrder | number |

## users

| Column | Type |
| --- | --- |
| id | string |
| email | string |
| name | string |
| role | admin \| user |
| active | boolean |
| createdAt | ISO datetime |

## settings

| Column | Type |
| --- | --- |
| key | string |
| value | string |
