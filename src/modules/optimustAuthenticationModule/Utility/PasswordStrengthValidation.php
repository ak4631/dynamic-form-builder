<?php

namespace Optimust\Authentication\Utility;

use Optimust\Authentication\Dto\UserCredential;
use ZxcvbnPhp\Zxcvbn;

class PasswordStrengthValidation
{
    private Zxcvbn $zxcvbn;

    public const VERY_WEAK = 0;
    public const WEAK = 1;
    public const BETTER = 2;
    public const STRONG = 3;
    public const STRONGEST = 4;

    public function __construct()
    {
        $this->zxcvbn = new Zxcvbn();
    }

    /**
     * @param UserCredential $credential
     * @return int
     */
    public function checkPasswordStrength(UserCredential $credential): int
    {
        //Add if condition in case of library change
        try {
            $strength =  $this->zxcvbn->passwordStrength($credential->getPassword());
            if ($strength['score'] == 0) {
                return self::VERY_WEAK;
            }
            if ($strength['score'] == 1) {
                return self::WEAK;
            }
            if ($strength['score'] == 2) {
                return self::BETTER;
            }
            if ($strength['score'] == 3) {
                return self::STRONG;
            }
            if ($strength['score'] == 4) {
                return self::STRONGEST;
            }
        } catch (\Throwable $e) {
        }
        return self::VERY_WEAK;
    }
}
