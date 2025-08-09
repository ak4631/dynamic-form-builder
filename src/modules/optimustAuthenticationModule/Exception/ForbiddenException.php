<?php

namespace Optimust\Authentication\Exception;

use Exception;
use Optimust\Framework\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ForbiddenException extends Exception implements HttpExceptionInterface
{
    /**
     * @var int
     */
    private int $statusCode = Response::HTTP_FORBIDDEN;

    /**
     * @var array
     */
    private array $headers = [];

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
