<?php

namespace Optimust\Core\Api\V1\Validator\Rules\Composite;

use Respect\Validation\Rules;

class AnyOf extends AbstractComposite
{
    /**
     * @inheritDoc
     */
    protected function getRuleClass(): string
    {
        return Rules\AnyOf::class;
    }
}
