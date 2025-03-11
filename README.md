# API Documentation

Down below we go through our API.

## Top 5 movies
- **URL**: /api/top-movies
- **Method**: GET
- **Description**: Gets at the most, top 5 movies based on rating from reviews.
- **Response**: JSON-object with movies
- **Status code 200**: Ok
- **Status code 500**: Could not load top 5 movies at this time.
- **Example Reponse** (can be less then 5 movies):
  ```
  {
    "movies": [
        {
            "id": 3,
            "title": "The Shawshank Redemption",
            "image": {
                "url": "https://m.media-amazon.com/images/M/  MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyM TMxODk2OTU@._V1_.jpg"
            }
        },
    ]
  }

  ```
## Reviews
- **URL**: /api/reviews/:id/:page
- **Method**: GET
- **Description**: Gets reviews and paginate to show five at a time
- **Response**: JSON-object with reviews and meta data
- **Status code 200**: Ok
- **Status code 500**: 'Couldn't get reviwes'
- **Example Reponse**:
  ```
  {
    "reviews": [
      {
        "author": "1",
        "rating": 1,
        "comment": "1"
      },
      {
        "author": "Test User",
        "rating": 5,
        "comment": "Bra film!"
      },
      {
        "author": "Kino-Reviewer",
        "rating": 3,
        "comment": "Bra film"
      },
      {
        "author": "string",
        "rating": 0,
        "comment": "heeejsan"
      },
      {
        "author": "Test User",
        "rating": 5,
        "comment": "Bra film!"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 5,
      "pageCount": 8,
      "total": 38
    }
  }
  ```

### Login
- **URL**: /api/login
- **Method**: POST
- **Description**: User sends username and password and the resource checks if they are authorized
- **Response**: JSON-object with boolean and a token
- **Status code 200**: Ok
- **Status code 401**: 'Not authorized'
- **Example Response**:
  ```
  {
    ok: true,
    token: jwt,
  }
  ```

### Send review
- **URL**: /api/reviews
- **Method**: GET
- **Description**: Uses the token from /api/login to check if they are authorized
- **Response**: JSON-object with boolean and message
- **Status code 200**: Ok
- **Status code 401**: 'Not authorized'
- **Example Response**:
  ```
  {
    ok: false,
    error: 'not allowed',
  }
  ```
## Screenings ID
- **URL**: /api/screenings/:ID
- **Method**: GET
- **Description**: Gets screening for movie Id, gets movie Id rating
- **Response**: JSON-object with screenings and meta data
- **Status code 200**: Ok
- **Status code 500**: 'Could not fetch any screenings'
- **query-string**: ?populate=movie?filters[movie]=Id
- **Id**: Is id for movie
- **Example Response**:
  ```
  {
  "data": [
      {
        "id": 337,
        "start_time": "2025-02-24T19:00:00.000Z",
        "room": "Stora salongen"
      },
      {
        "id": 296,
        "start_time": "2025-02-06T19:00:00.000Z",
        "room": "Stora salongen"
      }
    ]
  }
  ```

## Screenings next 5 days
- **URL**: /api/screenings
- **Method**: GET
- **Description**: Retrieves a list of screenings for the next five days, limited to a maximum of 10 screenings.
- **Response**: JSON-object containing the filtered screenings.
- **Status code 200**: OK
- **Status code 500**: Could not load screenings at this time.
- **Query string**: ?populate=movie
- **Example use**: /api/screenings?populate=movie
- **Example response**:
  ```
    [
      {
        "id": 296,
        "movie": "Encanto",
        "start_time": "2025-02-06T19:00:00.000Z",
        "room": "Stora salongen"
      },
      {
        "id": 297,
        "movie": "The Shawshank Redemption",
        "start_time": "2025-02-07T12:00:00.000Z",
        "room": "Stora salongen"
      }
    ]
  ```