<?php

namespace Optimust\Core\Controller\Exception;

use Exception;
use Optimust\Framework\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class RequestForwardableException extends Exception implements HttpExceptionInterface
{
    /**
     * @var string
     */
    private string $controller;

    /**
     * @var array
     */
    private array $attributes;

    /**
     * @var array
     */
    private array $query;

    /**
     * @var int
     */
    private int $statusCode = Response::HTTP_OK;

    /**
     * @var array
     */
    private array $headers = [];

    /**
     * @param string $controller
     * @param array $attributes
     * @param array $query
     */
    public function __construct(string $controller, array $attributes = [], array $query = [])
    {
        $this->controller = $controller;
        $this->attributes = $attributes;
        $this->query = $query;
    }

    /**
     * @return string
     */
    public function getController(): string
    {
        return $this->controller;
    }

    /**
     * @param string $controller
     */
    public function setController(string $controller): void
    {
        $this->controller = $controller;
    }

    /**
     * @return array
     */
    public function getAttributes(): array
    {
        return $this->attributes;
    }

    /**
     * @param array $attributes
     */
    public function setAttributes(array $attributes): void
    {
        $this->attributes = $attributes;
    }

    /**
     * @return array
     */
    public function getQuery(): array
    {
        return $this->query;
    }

    /**
     * @param array $query
     */
    public function setQuery(array $query): void
    {
        $this->query = $query;
    }

    /**
     * @return int
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @param int $statusCode
     */
    public function setStatusCode(int $statusCode): void
    {
        $this->statusCode = $statusCode;
    }

    /**
     * @return array
     */
    public function getHeaders(): array
    {
        return $this->headers;
    }

    /**
     * @param array $headers
     */
    public function setHeaders(array $headers): void
    {
        $this->headers = $headers;
    }
}
