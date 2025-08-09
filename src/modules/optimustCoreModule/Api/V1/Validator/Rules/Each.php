<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Exception;
use Optimust\Core\Api\V1\Validator\Rules\Composite\AbstractComposite;
use Respect\Validation\Helpers\CanValidateIterable;

class Each extends AbstractRule
{
    use CanValidateIterable;

    /**
     * @var AbstractComposite
     */
    private AbstractComposite $rule;

    public function __construct(AbstractComposite $rule)
    {
        $this->rule = $rule;
    }

    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if (!$this->isIterable($input)) {
            throw $this->reportError($input);
        }

        try {
            foreach ($input as $value) {
                if (!$this->rule->validate($value)) {
                    return false;
                }
            }
        } catch (Exception $e) {
            return false;
        }
        return true;
    }
}
