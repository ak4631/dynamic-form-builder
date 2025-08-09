<?php

namespace Optimust\Core\Traits;

trait ETagHelperTrait
{
    /**
     * @param string $data
     * @return string
     */
    protected function generateEtag(string $data): string
    {
        return base64_encode(hash('sha256', $data, true));
    }
}
