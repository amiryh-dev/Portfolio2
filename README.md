# Portfolio2

## Development

Install dependencies in the project root and in `client`, then start both the
API server and the Vite development server from the project root:

```sh
npm install
npm --prefix client install
npm run dev
```

The website is available at http://localhost:4173 and the API server at
http://localhost:3000. The API requires a reachable MongoDB instance configured
with `MONGODB_URI` in the root `.env` file. The server connects to the
`portfolio-college` database and creates the initial portfolio document the
first time it starts. Existing saved content is not overwritten on later starts.

The client loads the page content from `GET /api/portfolio`, projects from
`GET /api/projects` and education from `GET /api/qualifications`. The contact
form saves messages through `POST /api/contacts`. To host the client and API
separately, set `VITE_API_URL` to the API base URL before building the client.

## Accounts, roles and the dashboard

Anyone can create an account at http://localhost:4173/signup and sign in at
http://localhost:4173/signin. Signed-in users open the dashboard at
http://localhost:4173/dashboard:

- **Admin** — full CRUD: add, edit and delete projects and qualifications
  (each through its own REST API), edit the profile, page text, experience,
  skills, services and navigation, and read, edit and delete contact messages.
- **User** — read only: can view the same content but cannot change it.
  Contact messages are private and only visible to admins.

Sign-up (`POST /api/users`) always creates regular users. The admin account
is created directly in MongoDB with this script (it also promotes an existing
account):

```sh
npm run create-admin -- --email you@example.com --name "Your Name"
```

The script asks for the password in the terminal (or reads `ADMIN_PASSWORD`).

### API

| Resource | Public | Admin only |
| --- | --- | --- |
| `/auth/signin`, `/auth/signout` | sign in / sign out | |
| `/api/users` | `POST` sign up | `DELETE` all |
| `/api/projects`, `/api/projects/:id` | `GET` | `POST`, `PUT`, `DELETE` |
| `/api/qualifications`, `/api/qualifications/:id` | `GET` | `POST`, `PUT`, `DELETE` |
| `/api/contacts`, `/api/contacts/:id` | `POST` (contact form) | `GET`, `PUT`, `DELETE` |
| `/api/portfolio` | `GET` | `PUT` |

Admin routes need the header `Authorization: Bearer <token>` from
`/auth/signin`; tokens expire after 8 hours. The server checks the role in the
database on every admin request.
