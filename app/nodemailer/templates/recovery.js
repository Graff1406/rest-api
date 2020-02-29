exports.template = (subject, text, template) => {
  console.log("LOG: exports.template -> template", template)
  const msgContainer = `
    dispay: flex;
    flex-direction: row;
    justify-content: center;
  `

  const msgContainerCode = `
    border: 1px solid grey;
    padding: 0 10px;
    font-size: 20px;
  `

  return `
    <div style="${msgContainer}">
      <h1>${subject}</h1>
      <p>${text}</p>
      <h5>${template.title}</h5>
      <span style="${msgContainerCode}">
        <b>${template.psw}</b>
      </span>
    </div>
  `
}