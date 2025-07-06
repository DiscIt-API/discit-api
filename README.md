# 🥏 DiscIt API

RESTful API for disc golf discs.

Enables developers to programmatically access public disc information from the amazing [Marshall Street Disc Golf Interactive Flight Guide](https://www.marshallstreetdiscgolf.com/flightguide) web page. Disc data is refreshed nightly via the [DiscIt API Refresh Service](https://github.com/DiscIt-API/discit-api-refresh).

Check it out live on fly.io! [discit-api.fly.dev/disc](https://discit-api.fly.dev/disc)

## Public Endpoints

| Method | Route       | Description |
| ------ | ----------- | ----------- |
| `GET`  | `/disc`     | All discs   |
| `GET`  | `/disc?`    | By field(s) |
| `GET`  | `/disc/:id` | By id       |

## Example Requests

-   All discs: [`/disc`](https://discit-api.fly.dev/disc)
-   By one field: [`/disc?stability=very-overstable`](https://discit-api.fly.dev/disc?stability=very-overstable)
-   By multiple fields: [`/disc?brand=innova&category=control-driver`](https://discit-api.fly.dev/disc?brand=innova&category=control-driver)
-   By id: [`/disc/b61c0b30-f06b-5f66-a567-78287b003869`](https://discit-api.fly.dev/disc/b61c0b30-f06b-5f66-a567-78287b003869)

Refer to the **Fields** section below for all possible query string parameters, or check out the [Scalar API documentation](https://discit-api.fly.dev/reference). OpenAPI Specification .json data is also available at [discit-api.fly.dev/spec](https://discit-api.fly.dev/spec).

## Fields

| Field              | Searchable? | Search Operator | Description                                                                                                           |
| ------------------ | ----------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `id`               | Yes         | `=`             | Unique identifier of the disc                                                                                         |
| `name`\*           | Yes         | `LIKE`          | Name of the disc: `Aviar`, `Buzz`, `Crank SS`, etc.                                                                   |
| `brand`\*          | Yes         | `LIKE`          | Brand of the disc: `Innova`, `Discraft`, `Dynamic Discs`, etc.                                                        |
| `category`\*       | Yes         | `LIKE`          | `Distance Driver`, `Hybrid Driver`, `Control Driver`, `Midrange`, `Putter`                                            |
| `speed`            | Yes         | `=`             | The relative rate at which the disc can travel through the air: `1` to `15`                                           |
| `glide`            | Yes         | `=`             | The relative ability of the disc to maintain loft during its flight: `1` to `7`                                       |
| `turn`             | Yes         | `=`             | The tendency of the disc to turn over or bank to the right (for RHBH throws) at the start of its flight: `+1` to `-5` |
| `fade`             | Yes         | `=`             | The tendency of the disc to hook left (for RHBH throws) at the end of its flight: `0` to `5`                          |
| `stability`\*      | Yes         | `=`             | `Stable`, `Overstable`, `Very Overstable`, `Understable`, `Very Understable`                                          |
| `link`             | No          | N/A             | Link to search for the disc in the Marshall Street Disc Golf web store                                                |
| `pic`              | No          | N/A             | Link to a picture showing the approximate flight shape of the disc                                                    |
| `color`            | No          | N/A             | Text color for the disc on the Marshall Street Flight Guide page                                                      |
| `background_color` | No          | N/A             | Background color for the disc on the Marshall Street Flight Guide page                                                |

\* These fields use a URL-friendly **slug** string for search comparison. All non-alphanumeric characters are stripped out, and each space is replaced with a hyphen (e.g. `Crank SS` = `crank-ss`, `#1 Driver` = `1-driver`).

## Setup

-   Install [bun](https://bun.sh).
-   Install package dependencies: `bun install`
-   Create and populate a `.env` file based on the `.env.example` file in the root directory.
    -   `API_KEY`: Secret key used to authenticate requests to the API. Can be any string value, but must match the value used in the [discit-api-refresh](https://github.com/DiscIt-API/discit-api-refresh) project.
    -   `MONGO_URI` (optional): Connection string to a MongoDB database. If not provided, a Docker container will need to be used instead to host the database locally.
-   If not using a custom MongoDB connection string, install and run [Docker Desktop](https://www.docker.com/products/docker-desktop). Run `bun compose` to initialize the database container.
-   Run `bun dev` to start in watch mode (server restarts on file save).
-   Server will listen for requests on [localhost:5000](http://localhost:5000).
-   To populate the database with disc data, refer to the setup instructions for the [discit-api-refresh](https://github.com/DiscIt-API/discit-api-refresh) process.

## Technologies

-   [Bun](https://bun.sh/)
-   [Hono](https://hono.dev)
-   [MongoDB](https://www.mongodb.com)
-   [TypeScript](https://www.typescriptlang.org)

## See Also

-   [DiscIt](https://github.com/DiscIt-API/discit) - a responsive disc golf disc search engine that uses the DiscIt API.
-   [Marshall Street Disc Golf Interactive Flight Guide](https://www.marshallstreetdiscgolf.com/flightguide)
-   [PDGA REST API Services](https://www.pdga.com/dev/api/rest/v1/services)
-   [Disc Flight Ratings System](https://www.innovadiscs.com/home/disc-golf-faq/flight-ratings-system)
