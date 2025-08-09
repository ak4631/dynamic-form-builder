<?php

namespace Optimust\Core\Subscriber;

use Exception;
use Optimust\Config\Config;
use Optimust\Core\Traits\LoggerTrait;
use Optimust\Framework\Event\AbstractEventSubscriber;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class GlobalConfigSubscriber extends AbstractEventSubscriber
{
    use LoggerTrait;

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [
                ['onRequestEvent', 0],
            ],
        ];
    }

    /**
     * @param RequestEvent $event
     */
    public function onRequestEvent(RequestEvent $event)
    {
        $request = $event->getRequest();
        $this->setConfig(Config::DATE_FORMATTING_ENABLED, $request->query->getBoolean('_dateFormattingEnabled', false));
    }

    /**
     * @param string $key
     * @param $value
     */
    private function setConfig(string $key, $value): void
    {
        try {
            Config::set($key, $value);
        } catch (Exception $e) {
            $this->getLogger()->error($e->getMessage());
        }
    }
}
