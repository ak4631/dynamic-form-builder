<?php

namespace Optimust\Core\Controller;

use InvalidArgumentException;
use Optimust\Core\Traits\ControllerTrait;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Response;

abstract class AbstractController
{
    use ServiceContainerTrait;
    use ControllerTrait;

    /**
     * @var Response|RedirectResponse|null
     */
    protected $response = null;

    /**
     * @return Response
     */
    protected function getNewResponse(): Response
    {
        return new Response();
    }

    /**
     * @return Response|RedirectResponse
     */
    protected function getResponse()
    {
        if (!($this->response instanceof Response || $this->response instanceof RedirectResponse)) {
            $this->response = $this->getNewResponse();
        }
        return $this->response;
    }

    /**
     * @param RedirectResponse|Response|null $response
     */
    protected function setResponse($response): void
    {
        if (!($response instanceof Response ||
            $response instanceof RedirectResponse ||
            is_null($response))
        ) {
            throw new InvalidArgumentException(
                'Only allowed null, ' . Response::class . ', ' . RedirectResponse::class
            );
        }

        $this->response = $response;
    }

    /**
     * @param Response|null $response
     * @return Response
     */
    protected function handleBadRequest(?Response $response = null): Response
    {
        if (is_null($response)) {
            $response = $this->getResponse();
        }

        $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        return $response;
    }
}
