<?php

namespace Optimust\Core\Api\Rest;

use Optimust\Core\Api\V1\CollectionEndpoint;
use Optimust\Core\Api\V1\Endpoint;
use Optimust\Core\Api\V1\EndpointCollectionResult;
use Optimust\Core\Api\V1\EndpointResult;
use Optimust\Core\Api\V1\Model\ArrayCollectionModel;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;
use Optimust\Core\Traits\UserRoleManagerTrait;

class DataGroupAPI extends Endpoint implements CollectionEndpoint
{
    use UserRoleManagerTrait;

    /**
     * @inheritDoc
     */
    public function getAll(): EndpointResult
    {
        $dataGroupPermissionCollection = $this->getUserRoleManager()->getDataGroupPermissionCollection();
        return new EndpointCollectionResult(ArrayCollectionModel::class, $dataGroupPermissionCollection->toArray());
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection();
    }

    /**
     * @inheritDoc
     */
    public function create(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function delete(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForDelete(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
    }
}
