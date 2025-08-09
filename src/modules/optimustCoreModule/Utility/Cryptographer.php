<?php

namespace Optimust\Core\Utility;

use phpseclib3\Crypt\AES;
use phpseclib3\Crypt\Rijndael;

class Cryptographer
{
    private const KEY_LENGTH = 128;
    private const BLOCK_LENGTH = 128;
    private const MODE = 'ecb';

    private string $key;

    /**
     * @param string $key
     */
    public function __construct(string $key)
    {
        $this->key = $key;
    }

    /**
     * @param string|null $value
     * @return string|null
     */
    public function encrypt(?string $value): ?string
    {
        if (empty($value)) {
            return $value;
        }

        $rijndael = new Rijndael(self::MODE);

        $rijndael->setKeyLength(self::KEY_LENGTH);
        $rijndael->setBlockLength(self::BLOCK_LENGTH);
        $rijndael->setKey($this->generateKey());

        $encrypt = $rijndael->encrypt($value);

        return strtoupper(bin2hex($encrypt));
    }

    /**
     * @param string|null $encryptedValue
     * @return string|null
     */
    public function decrypt(?string $encryptedValue): ?string
    {
        if (empty($encryptedValue)) {
            return $encryptedValue;
        }

        $encryptedValue = pack('H*', $encryptedValue);
        $aes = new AES(self::MODE);

        $aes->setKeyLength(self::KEY_LENGTH);
        $aes->setKey($this->generateKey());

        return $aes->decrypt($encryptedValue);
    }

    /**
     * @return string
     */
    private function generateKey(): string
    {
        $generatedKey = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";

        for ($a = 0; $a < strlen($this->key); $a++) {
            $generatedKey[$a % 16] = chr(ord($generatedKey[$a % 16]) ^ ord($this->key[$a]));
        }

        return $generatedKey;
    }
}
