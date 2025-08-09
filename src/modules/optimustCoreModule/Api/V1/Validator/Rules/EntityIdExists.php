<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Core\Traits\ORM\EntityManagerHelperTrait;

class EntityIdExists extends AbstractRule
{
    use EntityManagerHelperTrait;

    /**
     * @var string
     */
    private string $entityName;

    /**
     * @var EntityIdExistsOption
     */
    private EntityIdExistsOption $option;

    public function __construct(string $entityName, ?EntityIdExistsOption $option = null)
    {
        $this->entityName = $entityName;
        $this->option = $option ?? new EntityIdExistsOption();
    }


    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if ($this->option->isNumeric() && !is_numeric($input)) {
            return false;
        } elseif ($this->option->isPositive() && !$input > 0) {
            return false;
        }

        $entity = $this->getRepository($this->entityName)->find($input);
        return $entity instanceof $this->entityName;
    }
}
