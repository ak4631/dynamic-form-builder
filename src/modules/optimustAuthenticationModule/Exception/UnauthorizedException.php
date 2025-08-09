<?php

namespace Optimust\Authentication\Exception;

use Exception;
use Optimust\Framework\Http\Response;
use Throwable;

class UnauthorizedException extends Exception
{
    /**
     * @var Response
     */
    private Response $response;

    /**
     * @param Response $response
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(Response $response, $message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->response = $response;
    }

    /**
     * @return Response
     */
    public function getResponse(): Response
    {
        return $this->response;
    }

    /**
     * @param Response $response
     */
    public function setResponse(Response $response): void
    {
        $this->response = $response;
    }
}
