# aws-lambda-component [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> elastic.io integration component that calls out to AWS Lambda API

# 
AWS Lambda Component component for the [elastic.io platform](http://www.elastic.io &#34;elastic.io platform&#34;)

If you plan to **deploy it into [elastic.io platform](http://www.elastic.io &#34;elastic.io platform&#34;) you must follow sets of instructions to succeed**.

## Authentication

Authentication is happening via OAuth2.0. In order to make OAuth work you need a new App in your XXX.
During app creation process you will be asked to specify
the callback URL, to process OAuth auehtncation via elastic.io platform your callback URL should be

```
https://your-tenant.elastic.io/callback/oauth2
```

If you are testing it on default public tenant just use ``https://app.elastic.io/callback/oauth2``


## Configure OAuth Client key/secret

In the component repository you need to specify OAuth Client credentials as environment variables. You would need two variables

 * ```XXX_KEY``` - your OAuth client key
 * ```XXX_SECRET``` - your OAUth client secret

## Actions


## Triggers


## Known issues

No known issues are there yet.

## License

Apache-2.0 © [elasticio](https://elastic.io)


[npm-image]: https://badge.fury.io/js/aws-lambda-component.svg
[npm-url]: https://npmjs.org/package/aws-lambda-component
[travis-image]: https://travis-ci.org/elasticio/aws-lambda-component.svg?branch=master
[travis-url]: https://travis-ci.org/elasticio/aws-lambda-component
[daviddm-image]: https://david-dm.org/elasticio/aws-lambda-component.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/elasticio/aws-lambda-component
