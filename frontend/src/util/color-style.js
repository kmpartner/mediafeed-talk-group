// // https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript/43195379

// individual letter classes:
export function letterCSS(letter, i, length, blueBoost) {
  // console.log('letter i length', letter, i, length)
  // let hue = Math.floor( i/length * 341); // between 0 and 340
  let hue = Math.floor(Math.random()*340);
  
  let saturation = 100;
  let lightness = 50;

  // color adjustment:
  if( blueBoost && hue > 215 && hue < 265) {
       const gain = 20;
       let blueness = 1 - Math.abs( hue-240)/25;
       let change  = Math.floor( gain * blueness);
       lightness += change;
       saturation -= change;
  }

  if( blueBoost && hue > 40 && hue < 80) {
    // const gain = 20;
    // let blueness = 1 - Math.abs( hue-240)/25;
    // let change  = Math.floor( gain * blueness);
    // // lightness += change;
    // // saturation -= change;
    lightness = 60;
    saturation = 50;
  }

  let hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

return `.${letter} {
color: ${hsl};
border-color: ${hsl};
background-color: rgb(231, 231, 231);
}
`   ;
}

// generate and display boxed letters of the alphabet
export function letterBlocks() {
  let letters = Array.from(
    // "ABCDEFGHI"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    );
  let cssText = "";
  let html = ""
  let blueBoost = document.getElementById("boost").checked;
  letters.forEach( (letter, i, a) => {
     cssText += letterCSS( letter, i, a.length, blueBoost);
     html  += ` <span class="letter ${letter}">${letter}<\/span> `;
    //  console.log('letter, i, a, cssText', letter, i, a, cssText)
  });

  // console.log('letters', letters)
  let style = document.createElement("style");
  style.textContent = cssText;
  document.body.appendChild(style);
  let p = document.getElementById("blocks");
  p.innerHTML = html;
}



export function getRandomBgColor(){ 
  // console.log('darkMode', localStorage.getItem('darkMode'));
  // return "hsl(" + 360 * Math.random() + ',' +
  //            (25 + 70 * Math.random()) + '%,' + 
  //           //  (85 + 10 * Math.random()) + '%)'
  //            (80 + 10 * Math.random()) + '%)'
  
  // return "hsl(" + (100 + 260 * Math.random()) + ',' +
  //            '40%,' + 
  //           //  (85 + 10 * Math.random()) + '%)'
  //            70 + '%)'
  
  return "hsl(" + Math.floor(360 * Math.random()) + ',' +
  '75%,' + 
  50 + '%)'
}