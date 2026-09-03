package com.restaurant.pos.service;

import java.util.List;

import com.restaurant.pos.dto.OrderDTO;
import com.restaurant.pos.dto.TableDTO;

public interface TableService {
List<TableDTO> findAll();
OrderDTO openTable(Integer tableNumber,Long employeeId);
OrderDTO findCurrentOrder(Integer tableNumber);
OrderDTO changeTable(Integer sourceTableNumber,Integer targetTableNumber);
OrderDTO mergeTable(Integer sourceTableNumber,Integer targetTableNumber);
}
