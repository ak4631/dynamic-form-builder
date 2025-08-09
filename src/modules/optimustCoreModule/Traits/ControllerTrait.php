<?php

namespace Optimust\Core\Traits;

use Optimust\Framework\Framework;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\RequestStack;
use Optimust\Framework\Http\Response;
use Optimust\Framework\Services;

trait ControllerTrait
{
    use ServiceContainerTrait;

    /**
     * Forwards the request to another controller.
     *
     * @param string $controller The controller name (a string like Optimust\Controller\PostController::handle)
     * @param array $attributes
     * @param array $query
     * @return Response
     */
    protected function forward(string $controller, array $attributes = [], array $query = []): Response
    {
        $request = $this->getCurrentRequest();
        $attributes['_controller'] = $controller;
        $subRequest = $request->duplicate($query, null, $attributes);

        /** @var Framework $kernel */
        $kernel = $this->getContainer()->get(Services::HTTP_KERNEL);
        return $kernel->handle($subRequest, Framework::SUB_REQUEST);
    }

    /**
     * @return Request|null
     */
    protected function getCurrentRequest(): ?Request
    {
        /** @var RequestStack $requestStack */
        $requestStack = $this->getContainer()->get(Services::REQUEST_STACK);
        return $requestStack->getCurrentRequest();
    }

    /**
     * @param string $path
     * @return RedirectResponse
     */
    protected function redirect(string $path): RedirectResponse
    {
        $request = $this->getCurrentRequest();
        $baseUrl = $request->getSchemeAndHttpHost() . $request->getBaseUrl();
        if (substr($path, 0, 1) !== '/') {
            $path = '/' . $path;
        }
        return new RedirectResponse($baseUrl . $path);
    }
}
