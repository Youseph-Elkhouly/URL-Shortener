🔗 URL Shortener Microservice
This is a full stack JavaScript microservice that allows users to shorten URLs and access them via a shortened identifier. It's part of my journey through the freeCodeCamp APIs and Microservices Certification and demonstrates core backend concepts like RESTful API design, input validation, and database integration.

🚀 Features
Accepts a valid URL via POST request to /api/shorturl

Validates URL format using the dns.lookup method

Stores the original URL in a MongoDB database with a numeric short code

Redirects users from /api/shorturl/:short_url back to the original URL

Returns { error: "invalid url" } for invalid submissions

🛠 Tech Stack
Node.js – JavaScript runtime environment

Express.js – Web framework for handling routes and middleware

MongoDB – NoSQL database for storing original and short URLs

dotenv – For managing environment variables

Glitch – Used for live deployment (can also be deployed on Render, Heroku, etc.)
