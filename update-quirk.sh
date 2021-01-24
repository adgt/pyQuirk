git submodule update --init --recursive --remote
pushd Quirk
npm install
npm run build
cp out/quirk.html ../js/lib
popd
