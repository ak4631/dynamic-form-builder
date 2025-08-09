<?php

namespace Optimust\Core\Subscriber;

use Optimust\Authentication\Controller\ForbiddenController;
use Optimust\Authentication\Exception\ForbiddenException;
use Optimust\Core\Authorization\Controller\CapableViewController;
use Optimust\Core\Authorization\Dto\ResourcePermission;
use Optimust\Core\Controller\AbstractViewController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\Traits\ControllerTrait;
use Optimust\Core\Traits\ModuleScreenHelperTrait;
use Optimust\Core\Traits\Service\TextHelperTrait;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Core\Traits\UserRoleManagerTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ScreenAuthorizationSubscriber extends AbstractEventSubscriber
{
    use ServiceContainerTrait;
    use UserRoleManagerTrait;
    use TextHelperTrait;
    use ModuleScreenHelperTrait;
    use ControllerTrait;

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

        $module = $this->getCurrentModuleAndScreen()->getModule();
        $screen = $this->getCurrentModuleAndScreen()->getScreen();

        if ($module === 'auth' && $screen == 'logout') {
            return;
        }

        if (($controller = $this->getControllerInstance($event)) instanceof AbstractViewController) {
            $permissions = $this->getUserRoleManager()->getScreenPermissions($module, $screen);

            if (!$permissions instanceof ResourcePermission || !$permissions->canRead()) {
                throw new ForbiddenException();
            }

            if ($controller instanceof CapableViewController) {
                if (!$controller->isCapable($event->getRequest())) {
                    throw new ForbiddenException();
                }
            }
        }
    }

    /**
     * @param ExceptionEvent $event
     */
    public function onExceptionEvent(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();
        if ($exception instanceof ForbiddenException) {
            $response = $this->forward(ForbiddenController::class . '::handle');
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
}
