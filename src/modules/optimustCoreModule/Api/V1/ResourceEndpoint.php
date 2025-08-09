<?php

namespace Optimust\Core\Api\V1;

use Optimust\Core\Api\V1\Exception\ForbiddenException;
use Optimust\Core\Api\V1\Exception\NotImplementedException;
use Optimust\Core\Api\V1\Exception\RecordNotFoundException;
use Optimust\Core\Api\V1\Serializer\NormalizeException;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;

interface ResourceEndpoint
{
    /**
     * Get one resource
     * @return EndpointResult
     * @throws NormalizeException
     * @throws RecordNotFoundException
     * @throws NotImplementedException
     * @throws ForbiddenException
     */
    public function getOne(): EndpointResult;

    /**
     * Validation rules for CollectionEndpoint::getOne
     * @return ParamRuleCollection
     * @throws NotImplementedException
     */
    public function getValidationRuleForGetOne(): ParamRuleCollection;

    /**
     * Update one resource
     * @return EndpointResult
     * @throws NormalizeException
     * @throws RecordNotFoundException
     * @throws NotImplementedException
     * @throws ForbiddenException
     */
    public function update(): EndpointResult;

    /**
     * Validation rules for CollectionEndpoint::update
     * @return ParamRuleCollection
     * @throws NotImplementedException
     */
    public function getValidationRuleForUpdate(): ParamRuleCollection;

    /**
     * Delete a resource
     * @return EndpointResult
     * @throws RecordNotFoundException
     * @throws NotImplementedException
     * @throws ForbiddenException
     */
    public function delete(): EndpointResult;

    /**
     * Validation rules for ResourceEndpoint::delete
     * @return ParamRuleCollection
     * @throws NotImplementedException
     */
    public function getValidationRuleForDelete(): ParamRuleCollection;
}
