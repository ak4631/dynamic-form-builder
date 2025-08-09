<?php

namespace Optimust\Core\Service;

class NumberHelperService
{
    /**
     * @param float $num
     * @param int $decimals
     * @return string
     * @link https://www.php.net/manual/en/function.number-format.php
     */
    public function numberFormat(float $num, int $decimals = 0): string
    {
        return number_format($num, $decimals, '.', '');
    }

    /**
     * @param float $num
     * @param int $decimals
     * @return string
     * @link https://www.php.net/manual/en/function.number-format.php
     */
    public function numberFormatWithGroupedThousands(
        float $num,
        int $decimals = 0,
        ?string $thousandsSeparator = ','
    ): string {
        return number_format($num, $decimals, '.', $thousandsSeparator);
    }
}
