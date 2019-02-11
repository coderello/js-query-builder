<p align="center"><img alt="JavaScript Query Builder" src="https://i.imgur.com/7OyksVL.png" width="500"></p>

<p align="center"><b>JavaScript Query Builder</b> provides an easy way to build a query string compatible with <a href="https://github.com/spatie/laravel-query-builder">spatie/laravel-query-builder</a>.</p>

## Install

You can install package using yarn (or npm):

```bash
yarn add js-query-builder
```

## Usage

Usage of this package is quite convenient.

### General example

Here is a simple example of query building:

```js
import { query } from 'js-query-builder';

const url = query('/users')
    .filter('age', 20)
    .sort('-created_at', 'name')
    .include('posts', 'comments')
    .append('fullname', 'ranking')
    .fields({
        posts: ['id', 'name'],
        comments: ['id', 'content'],
    })
    .param('custom_param', 'value')
    .page(1)
    .build();

console.log(url);
// /users?append=fullname%2Cranking&custom_param=value&fields%5Bcomments%5D=id%2Ccontent&fields%5Bposts%5D=id%2Cname&filter%5Bage%5D=20&include=posts%2Ccomments&page=1&sort=-created_at%2Cname

console.log(decodeURIComponent(url));
// /users?append=fullname,ranking&custom_param=value&fields[comments]=id,content&fields[posts]=id,name&filter[age]=20&include=posts,comments&page=1&sort=-created_at,name
```

### Making requests

This package does not provide ability to make requests because there is no need. You are not limited to any particular HTTP client. Use can use the one use want.

Here is an example with `axios`:

```js
import axios from 'axios';
import { query } from 'js-query-builder';

const activeUsers = axios.get(
    query('/users')
        .filter('status', 'active')
        .sort('-id')
        .page(1)
        .build()
);
```

### Conditions

Let's imagine that you need to filter by username only if its length is more that 3 symbols.

Yeah, you can do it like this:

```js
import { query } from 'js-query-builder';

const username = 'hi';

const q = query('/users');

if (username.length > 3) {
    q.filter('name', username);
}

const url = q.build();
```

But in such case it would be better to chain `.when()` method:

```js
import { query } from 'js-query-builder';

const username = 'hi';

const url = query('/users')
    .when(
        username.length > 3,
        q => q.filter('name', username)
    )
    .build();
```

Looks much more clear, does not it?

### Tapping

Sometimes you may want to tap the builder. `.tap()` method is almost the same as `.when()` but does not require condition.

```js
import { query } from 'js-query-builder';

const url = query('/users')
    .sort('id')
    .tap(q => {
        console.log(q.build());
    })
    .include('comments')
    .build();
```

### Forgetting

You need to forget some filters, sorts, includes etc.?

Here you are:

```js
import { query } from 'js-query-builder';

const url = query('/users')
    .include('comments', 'posts')
    .sort('name')
    .forgetInclude('comments')
    .build();
```

### Customizing parameter names

There may be cases when you need to customize parameter names.

You can define custom parameter names globally this way:

```js
import { query, QueryBuilder } from 'js-query-builder';

// you may make such call is application bootstrapping file
QueryBuilder.defineCustomParameterNames({
    page: 'p',
    sort: 's',
});

const url = query('/users')
    .sort('name')
    .page(5)
    .tap(q => console.log(decodeURIComponent(q.build())));

// /users?p=5&s=name
```

## Testing

```bash
yarn run test
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Credits

- [Ilya Sakovich](https://github.com/hivokas)
- [All Contributors](../../contributors)

Inspired by [robsontenorio/vue-api-query](https://github.com/robsontenorio/vue-api-query).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
