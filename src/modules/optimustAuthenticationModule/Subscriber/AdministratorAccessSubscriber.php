<?php

namespace Optimust\Authentication\Subscriber;

use Optimust\Authentication\Controller\AdminPrivilegeController;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\Service\TextHelperTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class AdministratorAccessSubscriber extends AbstractEventSubscriber
{
    use AuthUserTrait;
    use TextHelperTrait;

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => [
                ['onControllerEvent', -10000]
            ]
        ];
    }

    /**
     * @param ControllerEvent $controllerEvent
     * @return void
     */
    public function onControllerEvent(ControllerEvent $controllerEvent): void
    {
        if ($controllerEvent->getController()[0] instanceof AdminPrivilegeController) {
            return;
        }
        if ($controllerEvent->getController()[0] instanceof AbstractReactController) {
            $this->getAuthUser()->setHasAdminAccess(false);
        }
    }
}
