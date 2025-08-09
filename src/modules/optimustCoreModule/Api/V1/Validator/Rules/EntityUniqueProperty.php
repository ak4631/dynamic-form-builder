<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Core\Traits\ORM\EntityManagerHelperTrait;

class EntityUniqueProperty extends AbstractRule
{
    use EntityManagerHelperTrait;

    /**
     * @var string
     */
    private string $entityName;

    /**
     * @var string
     */
    private string $property;

    /**
     * @var EntityUniquePropertyOption
     */
    private EntityUniquePropertyOption $option;

    public function __construct(string $entityName, string $property, ?EntityUniquePropertyOption $option = null)
    {
        $this->entityName = $entityName;
        $this->property = $property;
        $this->option = $option ?? new EntityUniquePropertyOption();
    }


    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if ($this->option->isTrim()) {
            $input = $this->option->getTrimFunction()(($input));
        }

        $entityList = $this->getRepository($this->entityName)->findBy([$this->property => $input]);

        if (empty($entityList)) {
            return true;
        }

        return $this->option->hasIgnoreValues() && $this->entitiesHaveIgnoreValues($entityList);
    }

    /**
     * @param array $entities
     * @return bool
     */
    private function entitiesHaveIgnoreValues(array $entities): bool
    {
        $lastGetter = array_key_last($this->option->getIgnoreValues());
        foreach ($entities as $entity) {
            foreach ($this->option->getIgnoreValues() as $getter => $value) {
                if ($entity->$getter() === $value) {
                    break; //if entity has ignored value, skip to next entity
                }
                if ($getter === $lastGetter) {
                    return false; //if this point reached, entity has no ignored values
                }
            }
        }
        return true; //all entities have ignored values
    }
}
