<?php

namespace Optimust\Core\Utility;

trait EncryptionHelperTrait
{
    protected static ?Cryptographer $cryptographer = null;

    /**
     * @return Cryptographer|null
     */
    protected static function getCryptographer(): ?Cryptographer
    {
        if (KeyHandler::keyExists() && !self::$cryptographer instanceof Cryptographer) {
            self::$cryptographer = new Cryptographer(KeyHandler::readKey());
        }
        return self::$cryptographer;
    }

    /**
     * @return bool
     */
    protected static function encryptionEnabled(): bool
    {
        return self::getCryptographer() instanceof Cryptographer;
    }
}
