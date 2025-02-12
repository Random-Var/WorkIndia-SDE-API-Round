# WorkIndia-SDE-API-Round

The following endpoints have been implemented:
1. **POST** /api/auth/register - For registering new users
1. **POST** /api/auth/login - For authentication and role based access control for other endpoints
1. **POST** /api/trains - For adding new trains (Accessible to admins only)
1. **GET**  /api/trains - For getting seat availability of all trains between a source and a destination station
1. **POST** /api/bookings/:trainId - For booking a seat in the train with id equal to trainId
1. **GET**  /api/bookings/:trainId - For getting book details of the train with id equal to trainId

How to run this application?
1. Clone the repository.
2. Install the packages: `npm install`
3. Create a `.env` file. Copy the contents of the `.env.local` file. Replace the `user`, `password` and `mydb` with your own.
4. Build the JavaScript code from TypeScript code: `npm run build`
5. Run the server: `npm run start`
