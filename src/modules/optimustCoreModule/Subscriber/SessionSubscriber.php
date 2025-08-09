<?php

namespace Optimust\Core\Subscriber;

use Optimust\Config\Config;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Optimust\Framework\Http\Session\Session;
use Optimust\Framework\Services;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class SessionSubscriber extends AbstractEventSubscriber
{
    use ServiceContainerTrait;

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [
                ['onRequestEvent', 100000],
            ],
        ];
    }

    public function onRequestEvent(RequestEvent $event)
    {
        /** @var Session $session */
        $session = $this->getContainer()->get(Services::SESSION);

        if (time() - $session->getMetadataBag()->getLastUsed() > Config::get(Config::MAX_SESSION_IDLE_TIME)) {
            $session->invalidate();
        }
    }
}
