<?php

namespace Optimust\Core\Registration\Processor;

use InvalidArgumentException;
use Optimust\Entity\RegistrationEventQueue;

class RegistrationEventProcessorFactory
{
    /**
     * @param string $eventType
     * @return AbstractRegistrationEventProcessor
     */
    public function getRegistrationEventProcessor(string $eventType): AbstractRegistrationEventProcessor
    {
        throw new InvalidArgumentException("Invalid event type $eventType");
    }
}
