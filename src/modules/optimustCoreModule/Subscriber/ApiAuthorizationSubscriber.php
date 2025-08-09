<?php

namespace Optimust\Core\Subscriber;

use Optimust\Core\Api\V1\Exception\ForbiddenException;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\Controller\Rest\V1\AbstractRestController;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Core\Traits\UserRoleManagerTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiAuthorizationSubscriber extends AbstractEventSubscriber
{
    use ServiceContainerTrait;
    use UserRoleManagerTrait;

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => [
                ['onControllerEvent', 80000],
            ],
            KernelEvents::EXCEPTION => [
                ['onExceptionEvent', 0],
            ],
        ];
    }

    /**
     * @param ControllerEvent $event
     */
    public function onControllerEvent(ControllerEvent $event)
    {
        if ($this->getControllerInstance($event) instanceof PublicControllerInterface) {
            return;
        }

        if (!$this->getControllerInstance($event) instanceof AbstractRestController) {
            return;
        }

        $apiClass = $event->getRequest()->attributes->get('_api');
        if (is_null($apiClass)) {
            throw new ForbiddenException('`_api` parameter not defined in API routes');
        }
        $permissions = $this->getUserRoleManager()->getApiPermissions($apiClass);

        $permissionGetter = $this->getPermissionGetterMethod($event->getRequest()->getMethod());
        if (is_null($permissionGetter) || !$permissions->$permissionGetter()) {
            throw new ForbiddenException('Unauthorized');
        }
    }

    /**
     * @param ExceptionEvent $event
     */
    public function onExceptionEvent(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();
        if ($exception instanceof ForbiddenException) {
            $response = new Response();
            $message = 'Unauthorized';
            $code = Response::HTTP_FORBIDDEN;
            $response->setContent(
                \Optimust\Core\Api\V1\Response::formatError(
                    ['error' => ['status' => $code, 'message' => $message]]
                )
            );
            $response->headers->set(
                \Optimust\Core\Api\V1\Response::CONTENT_TYPE_KEY,
                \Optimust\Core\Api\V1\Response::CONTENT_TYPE_JSON
            );
            $response->setStatusCode($code);
            $event->setResponse($response);
            $event->stopPropagation();
        }
    }

    /**
     * @param ControllerEvent $event
     * @return mixed
     */
    private function getControllerInstance(ControllerEvent $event)
    {
        return $event->getController()[0];
    }

    /**
     * @param string $method
     * @return string|null
     */
    private function getPermissionGetterMethod(string $method): ?string
    {
        switch ($method) {
            case Request::METHOD_GET:
                return 'canRead';

            case Request::METHOD_POST:
                return 'canCreate';

            case Request::METHOD_PUT:
                return 'canUpdate';

            case Request::METHOD_DELETE:
                return 'canDelete';

            default:
                return null;
        }
    }
}
