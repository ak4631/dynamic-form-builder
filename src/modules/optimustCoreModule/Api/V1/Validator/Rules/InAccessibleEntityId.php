<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Core\Traits\ORM\EntityManagerHelperTrait;
use Optimust\Core\Traits\UserRoleManagerTrait;

class InAccessibleEntityId extends AbstractRule
{
    use UserRoleManagerTrait;
    use EntityManagerHelperTrait;

    /**
     * @var string
     */
    private string $entityName;

    /**
     * @var InAccessibleEntityIdOption
     */
    private InAccessibleEntityIdOption $option;

    public function __construct(string $entityName, ?InAccessibleEntityIdOption $option = null)
    {
        $this->entityName = $entityName;
        $this->option = $option ?? new InAccessibleEntityIdOption();
    }

    /**
     * @param mixed $input
     * @return bool
     */
    public function validate($input): bool
    {
        if ($this->option->isThrowIfOnlyEntityExist()) {
            $entity = $this->getRepository($this->entityName)->find($input);
            if (!$entity instanceof $this->entityName) {
                // ignore if entity not exists
                return true;
            }
        }

        $accessible = $this->getUserRoleManager()->isEntityAccessible(
            $this->entityName,
            $input,
            null,
            $this->option->getRolesToExclude(),
            $this->option->getRolesToInclude(),
            $this->option->getRequiredPermissions()
        );
        if ($this->option->isThrow() && !$accessible) {
            throw $this->option->getThrowable();
        } elseif (!$accessible) {
            return false;
        }
        return true;
    }
}
