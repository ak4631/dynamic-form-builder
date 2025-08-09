<?php

namespace Optimust\Core\Subscriber;

use Optimust\Core\Api\V1\Exception\ForbiddenException;
use Optimust\Core\Controller\Common\DisabledModuleController;
use Optimust\Core\Controller\Exception\RequestForwardableException;
use Optimust\Core\Service\ModuleService;
use Optimust\Core\Traits\Service\TextHelperTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ModuleNotAvailableSubscriber extends AbstractEventSubscriber
{
    use TextHelperTrait;

    /**
     * @var ModuleService|null
     */
    protected ?ModuleService $moduleService = null;

    /**
     * Get Module Service
     * @return ModuleService|null
     */
    public function getModuleService(): ModuleService
    {
        if (is_null($this->moduleService)) {
            $this->moduleService = new ModuleService();
        }
        return $this->moduleService;
    }

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [
                ['onRequestEvent', 200],
            ],
        ];
    }

    /**
     * @param RequestEvent $event
     * @throws ForbiddenException
     * @throws RequestForwardableException
     * @return void
     */
    public function onRequestEvent(RequestEvent $event): void
    {
        if ($event->isMainRequest()) {
            $disabledModules = $this->getModuleService()->getModuleDao()->getDisabledModuleList();
            foreach ($disabledModules as $disabledModule) {
                if ($this->getTextHelper()->strStartsWith($event->getRequest()->getPathInfo(), '/' . $disabledModule['name'])) {
                    throw new RequestForwardableException(DisabledModuleController::class . '::handle');
                }
                if ($this->getTextHelper()->strStartsWith($event->getRequest()->getPathInfo(), '/api/v1/' . $disabledModule['name'])) {
                    throw new ForbiddenException('Unauthorized');
                }
            }
        }
    }
}
