# shrtnr<br>
**Currently in development**<br>
An open source url shortener written with express, react and a few other tools<br><br>
TODO<br>
* sign up
* logging in
* dashboard (display analytics)
* add analytics capturing
* fix webpack output during tests (low priority)

<hr>

## API usage
To post a new URL to the server post to <code>/api/v1</code> with the message body as <code>{longUrl: "ht<span>tp://</span>example.com"}</code>. The server should respond with <code>{"longUrl":"ht<span>tp://</span>example.com","shortUrl":"ht<span>tp://</span>configdomain.com/4D9a2"}</code>. An invalid URL will return <code>"{"errorMessage":"Invalid URL"}"</code>.
