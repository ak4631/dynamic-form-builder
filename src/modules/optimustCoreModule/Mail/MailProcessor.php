<?php

namespace Optimust\Core\Mail;

use Optimust\Framework\Event\Event;

interface MailProcessor
{
    /**
     * @param string $emailName
     * @param AbstractRecipient $recipient
     * @param string $recipientRole
     * @param string $performerRole
     * @param Event $event
     * @return array
     */
    public function getReplacements(
        string $emailName,
        AbstractRecipient $recipient,
        string $recipientRole,
        string $performerRole,
        Event $event
    ): array;

    /**
     * @param string $emailName
     * @param string $recipientRole
     * @param string $performerRole
     * @param Event $event
     * @return AbstractRecipient[]
     */
    public function getRecipients(string $emailName, string $recipientRole, string $performerRole, Event $event): array;
}
