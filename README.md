# aws-lambda-component [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> elastic.io integration component that calls out to AWS Lambda API

#
AWS Lambda Component component for the [elastic.io platform](http://www.elastic.io &#34;elastic.io platform&#34;)

If you plan to **deploy it into [elastic.io platform](http://www.elastic.io &#34;elastic.io platform&#34;) you must follow sets of instructions to succeed**.

## Authentication

Authentication is implemented using AWS Security Key and AWS Security Secret. [Here](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html) you should be able to find 
instructions on how to generate them.

## Actions

### Invoke lambda function

If invocation was successful then action will try to parse resulting payload
as JSON and if it is successful then action will emit a new elastic.io message
with the resulting JSON as ``body``.

If parsing of the payload after successful invocation will fail then action
will emit a new message with a following body:
```json
{
  "result": "payload from the lambda invocation"
}
```


## Triggers


## Known issues

* Invocation Type ``DryRun`` is not supported - make no sense in the context

## License

Apache-2.0 © [elasticio](https://elastic.io)


[npm-image]: https://badge.fury.io/js/aws-lambda-component.svg
[npm-url]: https://npmjs.org/package/aws-lambda-component
[travis-image]: https://travis-ci.org/elasticio/aws-lambda-component.svg?branch=master
[travis-url]: https://travis-ci.org/elasticio/aws-lambda-component
[daviddm-image]: https://david-dm.org/elasticio/aws-lambda-component.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/elasticio/aws-lambda-component
