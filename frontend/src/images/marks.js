////  https://fontawesome.com/v4/icons/
// import classes from './marks.module.css';

import React from 'react';

export const marks = {
  checkMark: <strong style={{color: 'gray'}} >&#9745;</strong>, //// ☑
  noCheckMark: <span style={{color: 'gray'}} >&#9744;</span>, //// ☐
	
  fileMark: <i style={{color: 'gray'}} className="fa fa-file-o"></i>,
  fileFillMark: <i style={{color: 'gray'}} className="fa fa-file" aria-hidden="true"></i>,
  folderMark: <i style={{color: 'gray'}} className="fa fa-folder-o"></i>,
  folderOpenMark: <i style={{color: 'gray'}} className="fa fa-folder-open-o" aria-hidden="true"></i>,
  folderFillMark: <i style={{color: 'gray'}} className="fa fa-folder-o"></i>,
  folderFillOpenMark: <i style={{color: 'gray'}} className="fa fa-folder-open" aria-hidden="true"></i>,
  trashMark: <i style={{color: 'gray'}} className="fa fa-trash" aria-hidden="true"></i>,
  editMark: <i style={{color: 'gray'}} className="fa fa-pencil-square-o" aria-hidden="true"></i>,

  triangle: <span style={{color: 'gray'}} >&#9652;</span>,
  triangleDown: <span style={{color: 'gray'}} >&#9662;</span>,
  arrowCircleUp: <i style={{color: 'gray'}} className="fa fa-arrow-circle-up"></i>,
  
  spinner: <i style={{color: 'gray'}}  className="fa fa-circle-o-notch fa-spin fa-1x fa-fw"></i>,
  
  // closeMark: <i className="fa fa-times" aria-hidden="true"></i>,
  closeMark: <span style={{color: 'gray'}}>&#x2715;</span>,

  uploadMark: <i style={{color: 'gray'}} className="fa fa-upload" aria-hidden="true"></i>,
  downloadMark: <i style={{color: 'gray'}}  className="fa fa-download" aria-hidden="true"></i>,

  signInMark: <i style={{color: 'gray'}} className="fa fa-sign-in" aria-hidden="true"></i>,
  signOutMark: <i style={{color: 'gray'}} className="fa fa-sign-out" aria-hidden="true"></i>,
  userPlusMark: <i style={{color: 'gray'}} className="fa fa-user-plus" aria-hidden="true"></i>,
  userMark: <i style={{color: 'gray'}} className="fa fa-user" aria-hidden="true"></i>,

  gearMark: <i style={{color: 'gray'}} className="fa fa-cog" aria-hidden="true"></i>,
  bellMark: <i style={{color: 'gray'}} className="fa fa-bell" aria-hidden="true"></i>,
  bellRedMark: <i style={{color: 'red'}} className="fa fa-bell" aria-hidden="true"></i>,

  copyMark: <i style={{color: 'gray'}} className="fa fa-files-o" aria-hidden="true"></i>,
  moveMark: <i style={{color: 'gray'}} className="fa fa-share" aria-hidden="true"></i>,
  replyMark: <i style={{color: 'gray'}} className="fa fa-reply" aria-hidden="true"></i>,

  listUlMark: <i style={{color: 'gray'}} className="fa fa-list-ul" aria-hidden="true"></i>,
  tableMark: <i style={{color: 'gray'}} className="fa fa-table" aria-hidden="true"></i>,
  infoCircle: <i style={{color: 'gray'}} className="fa fa-info-circle" aria-hidden="true"></i>,

  qrcode: <i style={{color: 'gray'}} className="fa fa-qrcode" aria-hidden="true"></i>,
};