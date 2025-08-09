<?php

namespace Optimust\Core\Exception;

interface RedirectableException
{
    public function getRedirectUrl(): string;
}
