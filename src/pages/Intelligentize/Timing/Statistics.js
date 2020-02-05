/* eslint-disable react/jsx-no-bind */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Form, Input, Select, Button, DatePicker, Table, Radio, Tabs, Modal, Breadcrumb, Popconfirm, Icon } from 'antd';
import residue from '../../../utils/time';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;
const { Option } = Select;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return (
        <Select style={{ width: 120 }}>
          <Option value='1'>天</Option>
          <Option value='2'>周</Option>
          <Option value='3'>月</Option>
        </Select>
      );
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
@connect(({ select, timing, inspectors }) => ({
  select, timing, inspectors
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    formValues: {},
    pageNum: 1,
    pageSize: 10,
    selectedRowKeys: [],
    value: 1,
    visible: false,
    listbigAllClass: [],// 查询列表 所有案件大类
    listSmallAllClass: [],// 查询列表 所有案件小类
    complainDataModalList: {
      list: [],
      total: 0,
    },
    inspectorDataModalList: {
      list: [],
      total: 0,
    },
    comprehensiveDataModalList: {
      list: [],
      total: 0,
    },
    caseTypeVal: '',
    inspectBigValue: '',
    inspectSmallValue: '',
    underCentralizedTypeModal: '',
    complainFileName: '',
    inspectorFileName: '',
    comprehensiveFileName: '',
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '归口类型',
        dataIndex: 'centralizedType',
        editable: false,
      },
      {
        title: '智能生成周期',
        dataIndex: 'creatCycle',
        editable: true,
        width: 200,
        render: (text, record) => (
          <span>{record.creatCycle ? record.creatCycle : ''}</span>
        )
      },
      {
        title: '智能生成阀值',
        dataIndex: 'limitNum',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        // href="''"
                        onClick={() => this.complainSave(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.id)}>编辑</a>
                )}
            </div>
          );
        },
      },
    ];
    // 城管工单
    this.columnsInspector = [
      {
        title: '案件大类',
        dataIndex: 'caseBigTypeDesc',
        editable: false,
      },
      {
        title: '案件小类',
        dataIndex: 'caseSmallTypeDesc',
        editable: false,
      },
      {
        title: '智能生成周期',
        dataIndex: 'creatCycle',
        editable: true,
        width: 200,
        render: (text, record) => (
          <span>{record.creatCycle ? record.creatCycle : ''}</span>
        )
      },
      {
        title: '智能生成阀值',
        dataIndex: 'limitNum',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        // href="''"
                        onClick={() => this.inspectorSave(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.id)}>编辑</a>
                )}
            </div>
          );
        },
      },
    ];
    // 综合执法
    this.columnsComprehensive = [
      {
        title: '案件类型',
        dataIndex: 'caseTypeDesc',
        editable: false,
      },
      {
        title: '智能生成周期',
        dataIndex: 'creatCycle',
        editable: true,
        width: 200,
        // render: (text, record) => (
        //   <span>{record.creatCycle ? record.creatCycle : ''}</span>
        // )
      },
      {
        title: '智能生成阀值',
        dataIndex: 'limitNum',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        // href="''"
                        onClick={() => this.comprehensiveSave(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.id)}>编辑</a>
                )}
            </div>
          );
        },
      },
    ];
    this.state = {
      complainDataModalList: {// 投诉举报
        list: [],
        total: 0,
      },
      inspectorDataModalList: {// 城管工单
        list: [],
        total: 0,
      },
      comprehensiveDataModalList: {// 综合执法
        list: [],
        total: 0,
      },
      pageNum: 1,
      pageSize: 10,
      caseTypeVal: '',
      inspectBigValue: '',
      inspectSmallValue: '',
      underCentralizedTypeModal: '',
      comprehenseiveThreeCommunity: '',// 列表社区
      comprehenseiveThreeCaseType: '',// 列表案件类型
      comprehenseiveThreeStart: '',// 开始时间
      comprehenseiveThreeEnd: '',// 结束时间
      complainTwoArea: '',// 列表社区
      complainTwoCaseType: '',// 列表案件类型
      complainStart: '',// 开始时间
      complainEnd: '',// 结束时间
      inspectorTwoCommunity: '',// 列表社区
      inspectBigValueSearch: '',// 列表案件大类
      inspectorTwoSmall: '',// 列表案件小类
      inspectorStart: '',// 列表案件开始时间
      inspectorThreeEnd: '',// 列表案件结束时间
    };
  }

  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  // 投诉工单 智能生成规则 保存
  complainSave(form, rowId) {
    const { pageNum, pageSize } = this.state;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.setState({
        editingKey: '',
      });
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/editComplainDataModalFetch',
          payload: {
            resolve,
            id: rowId,
            creatCycle: row.creatCycle,
            limitNum: row.limitNum,
            pageNum,
            pageSize,
          }
        })
      }).then((res) => {
        this.setState({
          complainDataModalList: res.data,
        });
      })
    });
  }

  // 投诉工单 智能生成规则 查询
  handleComplainModal = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const underCentralizedType = values.complainUnderCentralizedTypeModal;
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/complainDataModalFetch',
          payload: {
            resolve,
            pageNum: 1,
            pageSize: 10,
            obj: {
              centralizedType_S_EQ: values.complainUnderCentralizedTypeModal || ''
            }
          }
        })
      }).then((res) => {
        this.setState({
          complainDataModalList: res.data,
        });
      });
      this.setState({
        pageNum: 1,
        pageSize: 10,
      })
    });
  };

  // 投诉工单 智能生成规则 重置
  handleComplainModalReset() {
    this.props.form.resetFields();
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/complainDataModalFetch',
        payload: {
          resolve,
          pageNum: 1,
          pageSize: 10,
        }
      })
    }).then((res) => {
      this.setState({
        complainDataModalList: res.data,
      })
    });
    this.setState({
      pageNum: 1,
      pageSize: 10,
      formValues: {},
    })
  }

  complainUnderModalSearch(val) {
    this.setState({
      underCentralizedTypeModal: val,
    })
  }

  // 投诉工单 智能生成规则 弹框 分页
  complainDataModalChange = (page, size) => {
    this.setState({
      pageNum: page,
      pageSize: size,
    });
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/complainDataModalFetch',
        payload: {
          resolve,
          pageNum: page,
          pageSize: size,
          underCentralizedType: this.state.underCentralizedTypeModal,
        }
      })
    }).then((res) => {
      this.setState({
        complainDataModalList: res.data,
        pageNum: page,
        pageSize: size,
      })
    });
  };

  // 城管工单 智能生成规则 保存
  inspectorSave(form, rowId) {
    const { pageNum, pageSize } = this.state;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.setState({
        editingKey: '',
      });
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/editInspectorDataModalFetch',
          payload: {
            resolve,
            id: rowId,
            creatCycle: row.creatCycle,
            limitNum: row.limitNum,
            pageNum,
            pageSize,
          }
        })
      }).then((res) => {
        this.setState({
          inspectorDataModalList: res.data,
        });
      })
    });
  }

  // 城管工单 智能生成规则 查询
  handleInspectorModal = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/inspectorDataModalFetch',
          payload: {
            resolve,
            pageNum: 1,
            pageSize: 10,
            obj: {
              caseBigType_S_EQ: values.largeClassInspectorModal,
              caseSmallType_S_EQ: values.smallClassInspectorModal
            }
          }
        })
      }).then((res) => {
        this.setState({
          inspectorDataModalList: res.data,
        })
      });
      this.setState({
        pageNum: 1,
        pageSize: 10,
      })
    });
  };

  // 城管工单 智能生成规则 重置
  handleInspectorModalReset() {
    this.props.form.resetFields();
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/inspectorDataModalFetch',
        payload: {
          resolve,
          pageNum: 1,
          pageSize: 10,
        }
      })
    }).then((res) => {
      this.setState({
        inspectorDataModalList: res.data,
      })
    });
    this.setState({
      pageNum: 1,
      pageSize: 10,
      formValues: {},
    })
  }

  // 城管工单 智能生成规则 弹框 分页
  inspectorDataModalChange = (page, size) => {
    this.setState({
      pageNum: page,
      pageSize: size,
    });
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/inspectorDataModalFetch',
        payload: {
          resolve,
          pageNum: page,
          pageSize: size,
          largeClass: this.state.inspectBigValue,
          smallClass: this.state.inspectSmallValue,
        }
      })
    }).then((res) => {
      this.setState({
        inspectorDataModalList: res.data,
        pageNum: page,
        pageSize: size,
      })
    });
  };

  // 综合执法工单 智能生成规则 保存
  comprehensiveSave(form, rowId) {
    const { pageNum, pageSize } = this.state;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.setState({ editingKey: '' });
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/editComprehensiveDataModalFetch',
          payload: {
            resolve,
            id: rowId,
            creatCycle: row.creatCycle,
            limitNum: row.limitNum,
            pageNum,
            pageSize,
          }
        })
      }).then((res) => {
        this.setState({
          comprehensiveDataModalList: res.data,
        });
      })
    });
  }

  // 综合执法工单 智能生成规则 查询
  handlecomprehensiveModal = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const caseType = values.comprehensiveCaseType;
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/comprehensiveDataModalFetch',
          payload: {
            resolve,
            pageNum: 1,
            pageSize: 10,
            obj: {
              caseType_S_EQ: values.comprehensiveCaseType
            }
          }
        })
      }).then((res) => {
        this.setState({
          comprehensiveDataModalList: res.data,
        })
      });
      this.setState({
        pageNum: 1,
        pageSize: 10,
        formValues: values,
      })
    });
  };

  // 综合执法工单 智能生成规则 重置
  handlecomprehensiveModalReset() {
    this.props.form.resetFields();
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/comprehensiveDataModalFetch',
        payload: {
          resolve,
          pageNum: 1,
          pageSize: 10,
        }
      })
    }).then((res) => {
      this.setState({
        comprehensiveDataModalList: res.data,
      })
    });
    this.setState({
      pageNum: 1,
      pageSize: 10,
      formValues: {},
      caseTypeVal: '',
    })
  }

  modalCaseType(val) {
    this.setState({
      caseTypeVal: val,
    });
  }

  // 综合执法工单 智能生成规则 弹框 分页
  comprehensiveDataModalChange = (page, size) => {
    this.setState({
      pageNum: page,
      pageSize: size,
    });
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/comprehensiveDataModalFetch',
        payload: {
          resolve,
          pageNum: page,
          pageSize: size,
          caseType: this.state.caseTypeVal,
        }
      })
    }).then((res) => {
      this.setState({
        comprehensiveDataModalList: res.data,
        pageNum: page,
        pageSize: size,
      })
    });
  };

  edit(id) {
    this.setState({ editingKey: id });
  }

  // 投诉举报工单 智能生成规则 弹框 下载
  downLoadComplain() {
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/downloadComplain',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      const link = document.createElement('a');
      res.blob.then((myblob) => {
        link.href = window.URL.createObjectURL(myblob);
        link.download = decodeURI(res.fileName);
        document.body.appendChild(link);
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      })
    })
  }

  // 投诉举报工单 智能生成规则 弹框 导入设置
  changeImportComplain() {
    const form = new FormData;
    const complainFile = document.getElementById('complainFile').files[0];
    if (complainFile) {
      this.setState({
        complainFileName: complainFile.name
      });
      form.append('file', complainFile);
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/importComplainExcelFetch',
          payload: {
            file: form,
            resolve,
          },
        })
      }).then((res) => {
        if (res.success) {
          new Promise(resolve => {
            this.props.dispatch({
              type: 'timing/complainDataModalFetch',
              payload: {
                resolve,
                pageNum: 1,
                pageSize: 10,
              }
            })
          }).then((res) => {
            this.setState({
              pageNum: 1,
              pageSize: 10,
              complainDataModalList: res.data,
            })
          });
          this.props.dispatch({
            type: 'timing/complainGeneratingRuleFetch',
            payload: {
              pageNum: 1,
              pageSize: 10,
            }
          });
        }
      });
    } else {
      this.setState({
        complainFileName: '',
      });
      message.error('请先选择需要导入的文件')
    }
  }
  ;
  // 城管工单 智能生成规则 弹框 下载
  downLoadInspector() {
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/downloadInspector',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      const link = document.createElement('a');
      res.blob.then((myblob) => {
        link.href = window.URL.createObjectURL(myblob);
        link.download = decodeURI(res.fileName);
        document.body.appendChild(link);
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      })
    })
  }

  // 城管工单 智能生成规则 弹框 导入设置
  changeImportInspector() {
    const form = new FormData;
    const inspectorFile = document.getElementById('inspectorFile').files[0];
    if (inspectorFile) {
      this.setState({
        inspectorFileName: inspectorFile.name
      });
      form.append('file', inspectorFile);
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/importInspectorExcelFetch',
          payload: {
            file: form,
            resolve,
          },
        })
      }).then((res) => {
        if (res.success) {
          new Promise(resolve => {
            this.props.dispatch({
              type: 'timing/inspectorDataModalFetch',
              payload: {
                resolve,
                pageNum: 1,
                pageSize: 10,
              }
            })
          }).then((res) => {
            this.setState({
              pageNum: 1,
              pageSize: 10,
              inspectorDataModalList: res.data,
            })
          });
          this.props.dispatch({
            type: 'timing/inspectorsGeneratingRuleFetch',
            payload: {
              pageNum: 1,
              pageSize: 10,
            }
          });
        }
      });
    } else {
      this.setState({
        inspectorFile: '',
      });
      message.error('请先选择需要导入的文件')
    }
  }
  ;
  // 综合执法工单 智能生成规则 弹框 下载
  downLoadComprehensive() {
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/downloadComprehensive',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      const link = document.createElement('a');
      res.blob.then((myblob) => {
        link.href = window.URL.createObjectURL(myblob);
        link.download = decodeURI(res.fileName);
        document.body.appendChild(link);
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      })
    })
  }

  // 综合执法工单 智能生成规则 弹框 导入设置
  changeImportComprehensive() {
    const form = new FormData;
    const comprehensiveFile = document.getElementById('comprehensiveFile').files[0];
    if (comprehensiveFile) {
      this.setState({
        comprehensiveFileName: comprehensiveFile.name
      });
      form.append('file', comprehensiveFile);
      new Promise(resolve => {
        this.props.dispatch({
          type: 'timing/importComprehensiveExcelFetch',
          payload: {
            file: form,
            resolve,
          },
        })
      }).then((res) => {
        if (res.success) {
          new Promise(resolve => {
            this.props.dispatch({
              type: 'timing/comprehensiveDataModalFetch',
              payload: {
                resolve,
                pageNum: 1,
                pageSize: 10,
              }
            })
          }).then((res) => {
            this.setState({
              pageNum: 1,
              pageSize: 10,
              comprehensiveDataModalList: res.data,
            })
          });
          this.props.dispatch({
            type: 'timing/comprehensiveGeneratingRuleFetch',
            payload: {
              pageNum: 1,
              pageSize: 10,
            }
          });
        }
      });
    } else {
      this.setState({
        comprehensiveFileName: '',
      });
      message.error('请先选择需要导入的文件')
    }
  }
  ;
  // 设置
  setUp = () => {
    // 投诉工单智能生成规则 弹框
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/complainDataModalFetch',
        payload: {
          resolve,
          pageNum: 1,
          pageSize: 10,
        }
      })
    }).then((res) => {
      if (res) {
        this.setState({
          complainDataModalList: res.data,
        })
      }
    });
    // 城管工单智能生成规则 弹框
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/inspectorDataModalFetch',
        payload: {
          resolve,
          pageNum: 1,
          pageSize: 10,
        }
      })
    }).then((res) => {
      this.setState({
        inspectorDataModalList: res.data,
      })
    });
    // 综合执法工单智能生成规则 弹框
    new Promise(resolve => {
      this.props.dispatch({
        type: 'timing/comprehensiveDataModalFetch',
        payload: {
          resolve,
          pageNum: 1,
          pageSize: 10,
        }
      })
    }).then((res) => {
      this.setState({
        comprehensiveDataModalList: res.data,
      })
    });
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
      caseTypeVal: '',
      inspectBigValue: '',
      inspectSmallValue: '',
      underCentralizedTypeModal: '',
      complainFileName: '',
      inspectorFileName: '',
      comprehensiveFileName: '',
      pageNum: 1,
      pageSize: 10,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      caseTypeVal: '',
      inspectBigValue: '',
      inspectSmallValue: '',
      underCentralizedTypeModal: '',
      complainFileName: '',
      inspectorFileName: '',
      comprehensiveFileName: '',
      pageNum: 1,
      pageSize: 10,
    });
  };

  componentDidMount() {
    // lookup
    // this.props.dispatch({
    //   type: 'timing/lookListCheck',
    //   payload: { creatCycle: this.columnsInspector[2].dataIndex },
    //   callback: res => {
    //     console.log(res)
    //   }
    // })

    // 投诉工单定时生成规则列表
    this.props.dispatch({
      type: 'timing/complainGeneratingRuleFetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      }
    });
    // 城管工单定时生成规则列表
    this.props.dispatch({
      type: 'timing/inspectorsGeneratingRuleFetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      }
    });
    // 综合执法工单定时生成规则列表
    this.props.dispatch({
      type: 'timing/comprehensiveGeneratingRuleFetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      }
    });
    // 查询列表 查询所有案件大类 bigAllClassFetch
    new Promise(resolve => {
      this.props.dispatch({
        type: 'inspectors/bigAllClassFetch',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      this.setState({
        listbigAllClass: res.data,
      })
    });
    // 社区
    this.props.dispatch({
      type: 'select/community',
    });
    // 归口类型
    this.props.dispatch({
      type: 'select/convergenceProgram',
    });
    // 案件类别
    this.props.dispatch({
      type: 'select/bigClass',
    });
    // 智能生成周期
    this.props.dispatch({
      type: 'select/intelligenceCycle',
    });
  }

  // 投诉工单 分页
  handleTableComplainChange = (page, size) => {
    this.setState({
      pageNum: page,
      pageSize: size,
    });
    this.props.dispatch({
      type: 'timing/complainGeneratingRuleFetch',
      payload: {
        pageNum: page,
        pageSize: size,
        area: this.state.complainTwoArea,
        underCentralizedType: this.state.complainTwoCaseType,
        startTime: this.state.complainStart,
        endTime: this.state.complainEnd,
      }
      // payload:Object.assign({pageNum:page,pageSize:size},this.state.formValues)
    })
  };

  // 投诉工单 列表 时间
  complainTime(val, time) {
    this.setState({
      complainStart: time[0],
      complainEnd: time[1],
    });
  }

  // 投诉工单 列表 社区
  complainTwoArea(val) {
    this.setState({
      complainTwoArea: val,
    });
  }

  // 投诉工单 列表 案件类型
  complainTwoCaseType(val) {
    this.setState({
      complainCaseType: val,
    });
  }

  // 投诉工单 查询
  handleComplain = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.complainCreateDate) {
        values.startTime = moment(values.complainCreateDate[0]).format('YYYY-MM-DD ')
      }
      if (values.complainCreateDate) {
        values.endTime = moment(values.complainCreateDate[1]).format('YYYY-MM-DD ')
      }

      this.props.dispatch({
        type: 'timing/complainGeneratingRuleFetch',
        payload: {
          pageNum: 1,
          pageSize: 10,
          obj: {
            communityNameDesc_S_EQ: values.complainArea || '',
            homecomingType_S_EQ: values.complainUnderCentralizedType || '',
            creatTime_D_GE: `${values.startTime}00:00:00`,
            creatTime_D_LE: `${values.endTime}23:59:59`,
          }
        }
      });
      this.setState({
        pageNum: 1,
        pageSize: 10,
      })
    });
  };

  // 定时生成投诉工单 重置
  handleComplainReset() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'timing/complainGeneratingRuleFetch',
      payload: { pageNum: 1, pageSize: 10 }
    });
    this.setState({
      pageNum: 1,
      pageSize: 10,
      formValues: {},
    })
  }

  // 城管工单 分页
  handleTableInspectorChange = (page, size) => {
    this.setState({
      pageNum: page,
      pageSize: size,
    });
    this.props.dispatch({
      type: 'timing/inspectorsGeneratingRuleFetch',
      payload: {
        pageNum: page,
        pageSize: size,
        area: this.state.inspectorTwoCommunity,
        largeClass: this.state.inspectBigValueSearch,
        smallClass: this.state.inspectorTwoSmall,
        startTime: this.state.inspectorStart,
        endTime: this.state.inspectorThreeEnd,
      }
      // payload:Object.assign({pageNum:page,pageSize:size},this.state.formValues)
    })
  };

  // 城管工单 列表 社区
  communityInspectorSearch(val) {
    this.setState({
      inspectorTwoCommunity: val,
    })
  }

  // 城管工单 列表 案件小类
  smallClassInspectorSearch(val) {
    this.setState({
      inspectorTwoSmall: val,
    })
  }

  timeInspectorSearch(start, end) {
    this.setState({
      inspectorStart: end[0],
      inspectorThreeEnd: end[1],
    })
  }

  // 城管工单 查询
  handleInspector = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.inspectorsCreateDate) {
        values.startTime = moment(values.inspectorsCreateDate[0]).format('YYYY-MM-DD ')
      }
      if (values.inspectorsCreateDate) {
        values.endTime = moment(values.inspectorsCreateDate[1]).format('YYYY-MM-DD ')
      }

      this.props.dispatch({
        type: 'timing/inspectorsGeneratingRuleFetch',
        payload: {
          pageNum: 1,
          pageSize: 10,
          obj: {
            communityNameDesc_S_EQ: values.inspectorCommunity || '',
            caseBigTypeDesc_S_EQ: values.largeClass || '',
            caseSmallTypeDesc_S_EQ: values.smallClass || '',
            creatTime_D_GE: `${values.startTime}00:00:00`,
            creatTime_D_LE: `${values.endTime}23:59:59`,
          }
        }
      });
      this.setState({
        pageNum: 1,
        pageSize: 10,
      })
    });
  };

  // 定时生成 城管工单 重置
  handleInspectorReset() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'timing/inspectorsGeneratingRuleFetch',
      payload: { pageNum: 1, pageSize: 10 }
    });
    this.setState({
      pageNum: 1,
      pageSize: 10,
      formValues: {},
    })
  }
  ;
  // 综合执法 分页
  handleTableComprehensiveChange = (page, size) => {
    this.setState({
      pageNum: page,
      pageSize: size,
    });
    this.props.dispatch({
      type: 'timing/comprehensiveGeneratingRuleFetch',
      payload: {
        pageNum: page,
        pageSize: size,
        area: this.state.comprehenseiveThreeCommunity,
        caseType: this.state.comprehenseiveThreeCaseType,
        startTime: this.state.comprehenseiveThreeStart,
        endTime: this.state.comprehenseiveThreeEnd,
      }
      // payload:Object.assign({pageNum:page,pageSize:size},this.state.formValues)
    })
  };

  // 综合执法 列表 社区
  comprehenseiveThreeCommunity(val) {
    this.setState({
      comprehenseiveThreeCommunity: val,
    })
  }

  // 综合执法 列表 案件类型
  comprehenseiveThreeCaseType(val) {
    this.setState({
      comprehenseiveThreeCaseType: val,
    })
  }

  comprehenseiveTime(start, end) {
    this.setState({
      comprehenseiveThreeStart: end[0],
      comprehenseiveThreeEnd: end[1],
    })
  }

  // 综合执法 查询
  handleCcomprehensive = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.ccomprehensiveCreateDate) {
        values.startTime = moment(values.ccomprehensiveCreateDate[0]).format('YYYY-MM-DD ')
      }
      if (values.ccomprehensiveCreateDate) {
        values.endTime = moment(values.ccomprehensiveCreateDate[1]).format('YYYY-MM-DD ')
      }

      this.props.dispatch({
        type: 'timing/comprehensiveGeneratingRuleFetch',
        payload: {
          pageNum: 1,
          pageSize: 10,
          obj: {
            communityName_S_EQ: values.ccomprehensiveCommunity || '',
            workOrderType_S_EQ: values.ccomprehensiveCaseType || '',
            creatTime_D_GE: `${values.startTime}00:00:00`,
            creatTime_D_LE: `${values.endTime}23:59:59`,
          }
        }
      });
      this.setState({
        pageNum: 1,
        pageSize: 10,
      })
    });
  };

  // 定时生成 综合执法 重置
  handleCcomprehensiveReset() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'timing/comprehensiveGeneratingRuleFetch',
      payload: { pageNum: 1, pageSize: 10 }
    });
    this.setState({
      pageNum: 1,
      pageSize: 10,
      formValues: {},
    })
  }
  ;
  // 列表案件大类弹框 查询 案件小类
  bigClassInspectorSearch = (value) => {
    const { form } = this.props;
    this.setState({
      inspectBigValueSearch: value,
    });
    // 案件小类
    if (value) {
      const { parentId } = this.state.listbigAllClass.filter(i => i.code == value)[0];
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/smallClassFetch',
          payload: {
            resolve,
            largeClassCode: parentId,
          }
        })
      }).then((res) => {
        this.setState({
          listSmallAllClass: res.data,
        });
      });
    } else {
      this.setState({
        listSmallAllClass: [],
      })
    }
    form.setFieldsValue({ smallClass: '' });
    form.setFieldsValue({ smallClassModal: '' })
  };

  // 列表案件大类弹框 查询 案件小类
  bigClassSearch = (value) => {
    const { form } = this.props;
    this.setState({
      inspectBigValue: value,
    });
    // 案件小类
    if (value) {
      const { parentId } = this.state.listbigAllClass.filter(i => i.code == value)[0];
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/smallClassFetch',
          payload: {
            resolve,
            largeClassCode: parentId,
          }
        })
      }).then((res) => {
        this.setState({
          listSmallAllClass: res.data,
        });
      });
    } else {
      this.setState({
        listSmallAllClass: [],
      })
    }
    form.setFieldsValue({ smallClass: '' });
    form.setFieldsValue({ smallClassInspectorModal: '' })
  };

  smallClassSearch = (value) => {
    this.setState({
      inspectSmallValue: value,
    })
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  // 返回
  goBackList() {
    this.props.history.go(-1);
  }
  ;
  // 弹框 tab页切换
  // eslint-disable-next-line class-methods-use-this
  callBackModal(key) {

  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'creatCycle' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const columnsInspector = this.columnsInspector.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'creatCycle' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const columnsComprehensive = this.columnsComprehensive.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'creatCycle' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { getFieldDecorator } = this.props.form;
    const { select, timing, inspectors } = this.props;
    const { communityList, convergenceProgramList, bigClassListSelect, intelligenceCycleList } = select;
    const { selectedRowKeys, pageNum, pageSize, listbigAllClass, listSmallAllClass, complainDataModalList, comprehensiveDataModalList, inspectorDataModalList } = this.state;
    const { complainGeneratingRuleList, inspectorsGeneratingRuleList, comprehensiveGeneratingRuleList } = timing;

    const that = this;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columnsComplain = [
      {
        title: '片区',
        dataIndex: 'communityName',
      },
      {
        title: '归口类型',
        dataIndex: 'homecomingType',
      },
      {
        title: '本周工作量',
        dataIndex: 'finishOrdersNum',
      },
      {
        title: '智能生成数量',
        dataIndex: 'increaseNum',
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
      },
    ];
    const columnsCityManagement = [
      {
        title: '片区',
        dataIndex: 'communityName',
      },
      {
        title: '案件大类',
        dataIndex: 'caseBigType',
      },
      {
        title: '案件小类',
        dataIndex: 'caseSmallType',
      },
      {
        title: '本周工单数量',
        dataIndex: 'finishOrdersNum',
      },
      {
        title: '智能生成数量',
        dataIndex: 'increaseNum',
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
      },
    ];
    const columnsLawEnforcement = [
      {
        title: '片区',
        dataIndex: 'communityName',
      },
      {
        title: '案件类别',
        dataIndex: 'workOrderTypeDesc',
      },
      {
        title: '本周工单数量',
        dataIndex: 'finishOrdersNum',
      },
      {
        title: '智能生成数量',
        dataIndex: 'increaseNum',
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
      },
    ];
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>智能生成</Breadcrumb.Item>
          <Breadcrumb.Item>定时生成</Breadcrumb.Item>
          <Breadcrumb.Item>智能生成统计</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">智能生成统计</h3>
          <div id="listOperator" style={{ paddingBottom: 0 }}>
            <Button type="primary" onClick={this.goBackList.bind(this)}><Icon type="caret-left" />返回</Button>
            <Button type="primary" onClick={this.setUp.bind(this)}>设置</Button>
          </div>
        </div>
        <div id="listTitleDetailTab">
          <Tabs defaultActiveKey="1" onChange={this.callback} type="card">
            <TabPane tab="投诉工单" key="1">
              <div id="tableForm">
                <Form layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={8}>
                      <FormItem label="查询时间">
                        {getFieldDecorator('complainCreateDate')(
                          <RangePicker placeholder={['开始时间', '结束时间']} onChange={this.complainTime.bind(this)} />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('complainArea')(
                          <Select placeholder="请选择" allowClear onChange={this.complainTwoArea.bind(this)}>
                            {communityList.map((val) => (
                              <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="归口类型">
                        {getFieldDecorator('complainUnderCentralizedType')(
                          <Select placeholder="请选择" allowClear onChange={this.complainTwoCaseType.bind(this)}>
                            {convergenceProgramList.map((val) => (
                              <Select.Option key={val.id} value={val.completeCases}>{val.completeCases}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8} style={{ textAlign: 'right' }}>
                      <Button type="primary" onClick={this.handleComplain.bind(this)}>
                        查询
                      </Button>
                      <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleComplainReset.bind(this)}>
                        重置
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div id="listTable">
                <Table
                  columns={columnsComplain}
                  dataSource={complainGeneratingRuleList.list}
                  rowKey={(record) => {
                    return record.id
                  }}
                  pagination={{
                    current: pageNum,
                    pageSize,
                    onShowSizeChange(current, pageSize) {
                      that.handleTableComplainChange(current, pageSize);
                    },
                    onChange(current, pageSize) {
                      that.handleTableComplainChange(current, pageSize);
                    },
                    total: complainGeneratingRuleList.total,
                    showTotal: total => `共 ${total} 条数据`,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10', '15', '20'],
                  }}
                />
              </div>
            </TabPane>
            <TabPane tab="城管工单" key="2">
              <div id="tableForm" style={{ paddingBottom: 20 }}>
                <Form layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={8}>
                      <FormItem label="查询时间">
                        {getFieldDecorator('inspectorsCreateDate')(
                          <RangePicker placeholder={['开始时间', '结束时间']} onChange={this.timeInspectorSearch.bind(this)} />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('inspectorCommunity')(
                          <Select placeholder="请选择" allowClear onChange={this.communityInspectorSearch.bind(this)}>
                            {communityList.map((val) => {
                              // console.log(val)
                              return (
                                <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                              )
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="案件大类">
                        {getFieldDecorator('largeClass')(
                          <Select placeholder="请选择" allowClear style={{ width: '100%' }} onChange={this.bigClassInspectorSearch.bind(this)}>
                            {
                              listbigAllClass ? (listbigAllClass.map((val) => {
                                return (
                                  <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                )
                              })) : []
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="案件小类">
                        {getFieldDecorator('smallClass')(
                          <Select placeholder="请选择" allowClear style={{ width: '100%' }} onChange={this.smallClassInspectorSearch.bind(this)}>
                            {
                              listSmallAllClass ? (listSmallAllClass.map((val) => (
                                <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                              ))) : []
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={24} sm={24} style={{ textAlign: 'right' }}>
                      <Button type="primary" onClick={this.handleInspector.bind(this)}>
                        查询
                      </Button>
                      <Button style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleInspectorReset.bind(this)}>
                        重置
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div id="listTable">
                <Table
                  columns={columnsCityManagement}
                  dataSource={inspectorsGeneratingRuleList.list}
                  rowKey={(record) => record.id}
                  pagination={{
                    current: pageNum,
                    pageSize,
                    onShowSizeChange(current, pageSize) {
                      that.handleTableInspectorChange(current, pageSize);
                    },
                    onChange(current, pageSize) {
                      that.handleTableInspectorChange(current, pageSize);
                    },
                    total: inspectorsGeneratingRuleList.total,
                    showTotal: total => `共 ${total} 条数据`,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10', '15', '20'],
                  }}
                />
              </div>
            </TabPane>
            <TabPane tab="综合执法工单" key="3">
              <div id="tableForm">
                <Form layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={8}>
                      <FormItem label="查询时间">
                        {getFieldDecorator('ccomprehensiveCreateDate')(
                          <RangePicker placeholder={['开始时间', '结束时间']} onChange={this.comprehenseiveTime.bind(this)} />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('ccomprehensiveCommunity')(
                          <Select placeholder="请选择" allowClear onChange={this.comprehenseiveThreeCommunity.bind(this)}>
                            {communityList.map((val) => {
                              return (
                                <Select.Option key={val.id} value={val.desp}>{val.desp}</Select.Option>
                              )
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="案件类别">
                        {getFieldDecorator('ccomprehensiveCaseType')(
                          <Select placeholder="请选择" allowClear onChange={this.comprehenseiveThreeCaseType.bind(this)}>
                            {bigClassListSelect.map((val) => (
                              <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8} style={{ textAlign: 'right' }}>
                      <Button type="primary" onClick={this.handleCcomprehensive.bind(this)}>
                        查询
                      </Button>
                      <Button style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleCcomprehensiveReset.bind(this)}>
                        重置
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div id="listTable">
                <Table
                  columns={columnsLawEnforcement}
                  dataSource={comprehensiveGeneratingRuleList.list}
                  rowKey={(record) => record.id}
                  pagination={{
                    current: pageNum,
                    pageSize,
                    onShowSizeChange(current, pageSize) {
                      that.handleTableComprehensiveChange(current, pageSize);
                    },
                    onChange(current, pageSize) {
                      that.handleTableComprehensiveChange(current, pageSize);
                    },
                    total: comprehensiveGeneratingRuleList.total,
                    showTotal: total => `共 ${total} 条数据`,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10', '15', '20'],
                  }}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
        <Modal
          width={1000}
          title="设置智能规则"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div id="listTitleDetailTabStatistics">
            <Tabs type="card" onChange={this.callBackModal.bind(this)} defaultActiveKey="1">
              <TabPane tab="投诉工单" key="1">
                <div id="tableForm" style={{ padding: '0 10px 0 0' }}>
                  <Form layout="inline" style={{ paddingTop: 20 }}>
                    <Row gutter={{ md: 48, lg: 48, xl: 48 }}>
                      <Col md={8} sm={8} style={{ float: 'right' }}>
                        <FormItem label="归口类型">
                          {getFieldDecorator('complainUnderCentralizedTypeModal', {
                            rules: [
                              {
                                required: false,
                                message: '请填写单据编号',
                              },
                            ],
                          })(
                            <Select placeholder="请选择" allowClear onChange={this.complainUnderModalSearch.bind(this)}>
                              {convergenceProgramList.map((val) => (
                                <Select.Option key={val.id} value={val.completeCases}>{val.completeCases}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={16} sm={16}>
                        <Button type="primary" onClick={() => this.downLoadComplain()}>
                          模板下载
                        </Button>
                        <div style={{ position: 'relative', width: 'auto', height: 20, lineHeight: '30px', marginTop: 10, marginLeft: 16, display: 'inline-block' }}>
                          <Button type='primary' style={{ position: 'absolute', top: 0, left: 0, textAlign: 'center', width: 'auto' }}>导入设置</Button>
                          <span style={{ marginLeft: 100 }}>{this.state.complainFileName}</span>
                          <input type="file" id='complainFile' onChange={this.changeImportComplain.bind(this)} style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, width: 98, height: 32, opacity: 0 }} />
                        </div>
                      </Col>
                      <Col md={8} sm={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={this.handleComplainModal.bind(this)}>
                          查询
                        </Button>
                        <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleComplainModalReset.bind(this)}>
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <div id="listTableModal" style={{ margin: '20px 0 20px 0' }}>
                    <Table
                      components={components}
                      bordered
                      rowKey={(record) => `${record.id}/${record.underCentralizedType}`}
                      dataSource={complainDataModalList.list}
                      columns={columns}
                      rowClassName="editable-row"
                      pagination={{
                        current: pageNum,
                        pageSize,
                        onShowSizeChange(current, pageSize) {
                          that.complainDataModalChange(current, pageSize);
                        },
                        onChange(current, pageSize) {
                          that.complainDataModalChange(current, pageSize);
                        },
                        total: complainDataModalList.total,
                        showTotal: total => `共 ${total} 条数据`,
                        size: 'small',
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '15', '20']
                      }}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="城管工单" key="2">
                <div id="tableForm" style={{ padding: '0 10px 0 0' }}>
                  <Form layout="inline" style={{ paddingTop: 20 }}>
                    <Row gutter={{ md: 48, lg: 48, xl: 48 }}>
                      <Col md={48} sm={48} style={{ float: 'right', width: '100%', marginRight: '-24px' }}>
                        <Col md={8} sm={8} style={{ float: 'right' }}>
                          <FormItem label="案件小类">
                            {getFieldDecorator('smallClassInspectorModal')(
                              <Select placeholder="请选择" allowClear style={{ width: '100%' }} onChange={this.smallClassSearch.bind(this)}>
                                {
                                  listSmallAllClass ? (listSmallAllClass.map((val) => (
                                    <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                  ))) : []
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={8} sm={8} style={{ float: 'right' }}>
                          <FormItem label="案件大类">
                            {getFieldDecorator('largeClassInspectorModal')(
                              <Select placeholder="请选择" allowClear style={{ width: '100%' }} onChange={this.bigClassSearch.bind(this)}>
                                {
                                  listbigAllClass ? (listbigAllClass.map((val) => (
                                    <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                  ))) : []
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={16} sm={16}>
                        <Button type="primary" onClick={() => this.downLoadInspector()}>
                          模板下载
                        </Button>
                        <div style={{ position: 'relative', width: 'auto', height: 20, lineHeight: '30px', marginTop: 10, marginLeft: 16, display: 'inline-block' }}>
                          <Button type='primary' style={{ position: 'absolute', top: 0, left: 0, textAlign: 'center', width: 'auto' }}>导入设置</Button>
                          <span style={{ marginLeft: 100 }}>{this.state.inspectorFileName}</span>
                          <input type="file" id='inspectorFile' onChange={this.changeImportInspector.bind(this)} style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, width: 98, height: 32, opacity: 0 }} />
                        </div>
                      </Col>
                      <Col md={8} sm={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={this.handleInspectorModal.bind(this)}>
                          查询
                        </Button>
                        <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleInspectorModalReset.bind(this)}>
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <div id="listTableModal" style={{ margin: '20px 0 20px 0' }}>
                    <Table
                      components={components}
                      bordered
                      rowKey={(record) => `${record.id}/${record.largeClass}/${record.smallClass}`}
                      dataSource={inspectorDataModalList.list}
                      columns={columnsInspector}
                      rowClassName="editable-row"
                      pagination={{
                        current: pageNum,
                        pageSize,
                        onShowSizeChange(current, pageSize) {
                          that.inspectorDataModalChange(current, pageSize);
                        },
                        onChange(current, pageSize) {
                          that.inspectorDataModalChange(current, pageSize);
                        },
                        total: inspectorDataModalList.total,
                        showTotal: total => `共 ${total} 条数据`,
                        size: 'small',
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '15', '20']
                      }}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="综合执法工单" key="3">
                <div id="tableForm" style={{ padding: '0 10px 0 0' }}>
                  <Form layout="inline" style={{ paddingTop: 20 }}>
                    <Row gutter={{ md: 48, lg: 48, xl: 48 }}>
                      <Col md={8} sm={8} style={{ float: 'right' }}>
                        <FormItem label="案件类别">
                          {getFieldDecorator('comprehensiveCaseType', {
                            rules: [
                              {
                                required: false,
                                message: '请填写单据编号',
                              },
                            ],
                          })(
                            <Select placeholder="请选择" allowClear onChange={this.modalCaseType.bind(this)}>
                              {bigClassListSelect.map((val) => (
                                <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={16} sm={16}>
                        <Button type="primary" onClick={() => this.downLoadComprehensive()}>
                          模板下载
                        </Button>
                        <div style={{ position: 'relative', width: 'auto', height: 20, lineHeight: '30px', marginTop: 10, marginLeft: 16, display: 'inline-block' }}>
                          <Button type='primary' style={{ position: 'absolute', top: 0, left: 0, textAlign: 'center', width: 'auto' }}>导入设置</Button>
                          <span style={{ marginLeft: 100 }}>{this.state.comprehensiveFileName}</span>
                          <input type="file" id='comprehensiveFile' onChange={this.changeImportComprehensive.bind(this)} style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, width: 98, height: 32, opacity: 0 }} />
                        </div>
                      </Col>
                      <Col md={8} sm={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={this.handlecomprehensiveModal.bind(this)}>
                          查询
                        </Button>
                        <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handlecomprehensiveModalReset.bind(this)}>
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <div id="listTableModal" style={{ margin: '20px 0 20px 0' }}>
                    <Table
                      components={components}
                      bordered
                      rowKey={(record) => `${record.id}/${record.caseType}`}
                      dataSource={comprehensiveDataModalList.list}
                      columns={columnsComprehensive}
                      rowClassName="editable-row"
                      pagination={{
                        current: pageNum,
                        pageSize,
                        onShowSizeChange(current, pageSize) {
                          that.comprehensiveDataModalChange(current, pageSize);
                        },
                        onChange(current, pageSize) {
                          that.comprehensiveDataModalChange(current, pageSize);
                        },
                        total: comprehensiveDataModalList.total,
                        showTotal: total => `共 ${total} 条数据`,
                        size: 'small',
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '15', '20']
                      }}
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Workplace;
