<?php

namespace Optimust\Core\Api\V1;

use Optimust\Framework\Http\Request as HttpRequest;

class Request
{
    public const METHOD_GET = 'GET';
    public const METHOD_POST = 'POST';
    public const METHOD_PUT = 'PUT';
    public const METHOD_PATCH = 'PATCH';
    public const METHOD_DELETE = 'DELETE';

    /**
     * @var HttpRequest
     */
    protected HttpRequest $httpRequest;

    /**
     * Request body parameters ($_POST)
     * @var ParameterBag
     */
    protected ParameterBag $body;

    /**
     * Parameters from URL
     * @var ParameterBag
     */
    protected ParameterBag $attributes;

    /**
     * Query string parameters ($_GET)
     * @var ParameterBag
     */
    protected ParameterBag $query;

    public function __construct(HttpRequest $httpRequest)
    {
        $this->httpRequest = $httpRequest;
        $this->body = new ParameterBag($this->getHttpRequest()->request->all());
        $this->attributes = new ParameterBag($this->getHttpRequest()->attributes->all());
        $this->query = new ParameterBag($this->getHttpRequest()->query->all());
    }

    /**
     * @return HttpRequest
     */
    public function getHttpRequest(): HttpRequest
    {
        return $this->httpRequest;
    }

    /**
     * @return ParameterBag
     */
    public function getBody(): ParameterBag
    {
        return $this->body;
    }

    /**
     * @param ParameterBag $body
     * @internal
     */
    public function setBody(ParameterBag $body): void
    {
        $this->body = $body;
    }

    /**
     * @return ParameterBag
     */
    public function getAttributes(): ParameterBag
    {
        return $this->attributes;
    }

    /**
     * @param ParameterBag $attributes
     * @internal
     */
    public function setAttributes(ParameterBag $attributes): void
    {
        $this->attributes = $attributes;
    }

    /**
     * @return ParameterBag
     */
    public function getQuery(): ParameterBag
    {
        return $this->query;
    }

    /**
     * @param ParameterBag $query
     * @internal
     */
    public function setQuery(ParameterBag $query): void
    {
        $this->query = $query;
    }

    /**
     * @return array
     */
    public function getAllParameters(): array
    {
        return array_merge(
            $this->getBody()->all(),
            $this->getAttributes()->all(),
            $this->getQuery()->all(),
        );
    }
}
