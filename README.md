# FullStack Log-Ingest-Query WebApp: Next.js 14, React, Prisma, Tailwind, MongoDB & TypeScript.

Deployed Instance of App in Vercel: [LINK - Click Here](https://log-ingestor-query.vercel.app/)

Features:

- Ingest high volumes of data to POST `http://localhost:3000/api`
- Sort, Query data in a tabular format
- Server Side Sort, Query, Filter & Pagination
- Responsive UI
- Fully TypeSafe with TypeScript
- Next.js 14 App Router for Handling HTTP Requests

TODO:

- Filter by Date
- Regex Filter
- Realtime Log Ingestion
- Input Filter validation with 'zod'

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/nayak-nirmalya/log-ingestor-query.git
```

### Install packages

```shell
npm install
```

### Setup .env File

```js
DATABASE_URL=
```

### Setup Prisma

Add MongoDB Database URL (MongoDB Atlas)

```shell
npx prisma generate
npx prisma db push
```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command      | description                                              |
| :----------- | :------------------------------------------------------- |
| `dev`        | Starts a development instance of the app                 |
| `lint`       | Run lint check                                           |
| `build`      | Start building app for deployment                        |
| `start`      | Run build version of app                                 |
| `seed`       | Seed/Ingest random dummy data in given format to the app |
| `prisma:std` | Start studio to visualize & edit database                |

## Preview

<div align='center'>

### Home Screen

<img src="https://github.com/nayak-nirmalya/log-ingestor-query/assets/52202635/4103674f-41d7-44d8-972f-050d200e8e91" width="80%">

### Filter Single Column

<img src="https://github.com/nayak-nirmalya/log-ingestor-query/assets/52202635/8d887d9b-0789-4f4a-b663-42050a2df321" width="80%">

### Filter Multiple Column with Partial Text Search

<img src="https://github.com/nayak-nirmalya/log-ingestor-query/assets/52202635/5afa8b5e-88a1-4f9e-9076-5f10cbe74fc7" width="80%">

### Filter Multiple Column with Partial/Case-Insensitive Text with Sort & Pagination

<img src="https://github.com/nayak-nirmalya/log-ingestor-query/assets/52202635/93a74938-ee68-4ff0-8924-c7938ecad783" width="80%">

### Global Partial Text Search

<img src="https://github.com/nayak-nirmalya/log-ingestor-query/assets/52202635/776c58a0-c34f-468e-a9a3-a90fe71e8535" width="80%">

</div>
