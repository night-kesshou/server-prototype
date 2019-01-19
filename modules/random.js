module.exports = (len = 256, str = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+=/") => {
  let result = "";
  while(result.length<len)
    result+=str[~~(Math.random()*str.length)];
  return result;
}