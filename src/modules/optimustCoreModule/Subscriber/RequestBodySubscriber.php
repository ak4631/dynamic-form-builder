<?php

namespace Optimust\Core\Subscriber;

use Optimust\Framework\Event\AbstractEventSubscriber;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestBodySubscriber extends AbstractEventSubscriber
{
    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [
                ['onRequestEvent', 99000],
            ],
        ];
    }

    public function onRequestEvent(RequestEvent $event)
    {
        $request = $event->getRequest();

        // 'application/json', 'application/x-json'
        if ($request->getContentTypeFormat() === 'json') {
            if ($request->getContent() !== '') {
                $data = json_decode($request->getContent(), true);
                if (is_array($data)) {
                    $request->request->add($data);
                }
            }
        }
    }
}
