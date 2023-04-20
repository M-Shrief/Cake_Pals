## Overview

CakePals is an app where people can sell home-baked cakes and pies to each other. There are Bakers
who can register on CakePals and list their products for sale. App users typically look for available
offerings nearby, create a member account (if needed) and place a baking order. Bakers receive orders,
bake and hand over ready products at the agreed collection time.

## Specs

- There's 3 types of users: Guests, Members and Bakers.
- Bakers have products (name, description, price, type). plus, they can add, edit and remove them.
- Guests and Members can search for bakers in certain distance from a specified location.
- Ordered products' preparation time are calculated, then we check baker's schedule to know if he has enough time to prepare it before collection time.
- Orders are set "On Hold", untill specified baker accepts it.

## Technologies && Techniques

**Main:** Nodejs/Expressjs in TypeScript, with MongoDB.

**used Techniques**:

- _JWT_ for Authentication & Authorization
- _Express-validatior_ to validate users requests
- _winston & morgan_ as Loggers
- _Dayjs_ to deal with dates and times

**Coming up**:

- Add automated Tests for API's end-points
- Better documentation
