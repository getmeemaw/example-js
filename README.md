# example-js
Example of a web app using Meemaw

## How to use
We recommend you check our [Getting Started](https://getmeemaw.com/docs/getting-started). This will be the most efficient way to get running and make sure you're not missing anything

## Deploy server

- In `server/config.toml`, update `supabaseUrl` and `supabaseApiKey` with yours
- In the server directory: `docker compose up`
    - You should be greeted with a bunch of text, including something like this:
    ```
    meemaw_app  | 2042/05/04 11:59:59 Logging enabled
    meemaw_app  | 2042/05/04 11:59:59 Connected to DB
    meemaw_app  | 2042/05/04 11:59:59 Schema does not exist, creating...
    meemaw_app  | 2042/05/04 11:59:59 Schema loaded
    meemaw_app  | 2042/05/04 11:59:59 Starting server on port 8421
    ```

## Run the example

### Configure your App
- Update the following line with the URL of your JSON-RPC API:
    ```javascript title="client/src/app/tx.jsx"
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8421/rpc"));
    ```
- Modify `.env.local` in the `client/` folder, replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_API_KEY` with yours.

### Install dependencies and run the app
Open a new terminal and make sure you're in the client directory:

```
npm install
npm run dev
```

You should now see something like this in your terminal, amongst other things :

```
Local:        http://localhost:3000
```

Just visit [http://localhost:3000](http://localhost:3000) and you should see our app 🥳

If anything does not work as expected, join us on Discord! We will happily help get you started.