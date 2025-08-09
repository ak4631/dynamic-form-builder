<?php

namespace Optimust\Core\Mail;

abstract class AbstractRecipient
{
    /**
     * @return string
     */
    abstract public function getEmailAddress(): string;

    /**
     * Get email recipient full name
     * @return string
     */
    abstract public function getName(): string;
}
