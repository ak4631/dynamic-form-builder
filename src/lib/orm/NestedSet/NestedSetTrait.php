<?php

namespace Optimust\ORM\NestedSet;

use Optimust\ORM\Doctrine;
use Optimust\ORM\ListSorter;

trait NestedSetTrait
{
    /**
     * @param int|null $depth
     * @return NestedSetInterface[]|array
     * @throws NestedSetException
     */
    public static function fetchTree(?int $depth = null): array
    {
        $entityClass = get_called_class();
        if (!(in_array(NestedSetInterface::class, array_values(class_implements($entityClass))))) {
            throw new NestedSetException(
                sprintf(
                    'Expected called class implements `%s`, and got called class as `%s`',
                    NestedSetInterface::class,
                    $entityClass
                )
            );
        }

        $q = Doctrine::getEntityManager()->getRepository($entityClass)->createQueryBuilder('e');
        $q->andWhere('e.lft >= :lft');
        $q->setParameter('lft', 1);
        $q->addOrderBy('e.lft', ListSorter::ASCENDING);
        if (!is_null($depth)) {
            $q->andWhere($q->expr()->between('e.level', ':from', ':to'));
            $q->setParameter('from', 0);
            $q->setParameter('to', $depth);
        }

        return $q->getQuery()->execute();
    }
}
